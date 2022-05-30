import axios from 'axios';
import md5 from 'md5';
import { StandardRuleset, StandardDifficultyAttributes } from 'osu-standard-stable';
import { TaikoRuleset, TaikoDifficultyAttributes } from 'osu-taiko-stable';
import { CatchRuleset, CatchDifficultyAttributes } from 'osu-catch-stable';
import { ManiaRuleset, ManiaDifficultyAttributes } from 'osu-mania-stable';
import { BeatmapInfo, ScoreInfo, UserInfo } from 'osu-classes';

class APICache extends Map {
  set(key, value) {
    super.set(key, value);

    if (value.expiresIn) {
      setTimeout(() => super.delete(key), value.expiresIn);
    }

    return this;
  }
}

class APIClient {
  constructor() {
    this.cache = new APICache();
  }
  static getInstance() {
    const constructor = this.prototype.constructor;
    const existingInstance = this._instances.get(constructor);

    if (existingInstance) {
      return existingInstance;
    }

    const newInstance = new constructor();

    this._instances.set(constructor, newInstance);

    return newInstance;
  }
  async _request(config) {
    try {
      const hash = md5(JSON.stringify(config));
      const cached = this.cache?.get(hash);

      if (cached) {
        return cached;
      }

      const response = await axios.request({
        ...this.config, ...config,
      });
      const result = {
        url: config.url,
        status: response.status,
        data: response.data,
        error: null,
      };

      this.cache?.set(hash, {
        ...result,
        expiresIn: 30000,
      });

      return result;
    }
    catch (err) {
      const axiosError = err;
      const response = axiosError?.response ?? null;
      const data = response?.data ?? null;
      let error = data?.error
                ?? data?.message
                ?? response?.statusText
                ?? axiosError?.message;

      if (axiosError?.code === 'ECONNREFUSED') {
        error = 'Can\'t connect to API!';
      }

      if (!error) {
        error = 'An unknown error has occured!';
      }

      return {
        url: config.url,
        status: response?.status ?? 500,
        data: null,
        error,
      };
    }
  }
  get config() {
    return {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
  }
}
APIClient._instances = new Map();

class APIClientWithOAuth extends APIClient {
  constructor() {
    super(...arguments);
    this._clientId = null;
    this._clientSecret = null;
    this._tokens = null;
  }
  addCredentials(clientId, clientSecret) {
    this._clientId = clientId ?? this._clientId;
    this._clientSecret = clientSecret ?? this._clientSecret;
  }
  get isAuthorized() {
    return this._tokens !== null && this._tokens.isValid;
  }
  async _request(config) {
    if (!this.isAuthorized) {
      await this.authorize();
    }

    let attempts = 0;

    const request = async(config) => {
      try {
        return super._request(config);
      }
      catch (err) {
        const axiosError = err;
        const status = axiosError?.response?.status;

        if (attempts < 3 && status === 401 && await this.authorize()) {
          return request(config);
        }

        attempts++;
        throw err;
      }
    };

    return await request(config);
  }
  get config() {
    return {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._tokens?.accessToken ?? ''}`,
      },
    };
  }
}

class AuthTokens {
  constructor() {
    this.accessToken = '';
    this.refreshToken = '';
    this.type = '';
    this.expiresAt = new Date();
  }
  get expiresIn() {
    const difference = this.expiresAt.getTime() - Date.now();

    return Math.trunc(difference / 1000);
  }
  get isExpired() {
    return this.expiresIn < 10;
  }
  get isValid() {
    return this.accessToken.length > 0 && !this.isExpired;
  }
}

class URLGenerator {
  constructor() {
    this.SERVER_ROOT = 'https://osu.ppy.sh';
    this.ASSETS_ROOT = 'https://assets.ppy.sh';
    this.AVATARS_ROOT = 'https://a.ppy.sh';
  }
  generateUserURL(user) {
    return `${this.SERVER_ROOT}/u/${user}`;
  }
  generateBeatmapURL(beatmapId, rulesetId) {
    const url = new URL(`${this.SERVER_ROOT}/b/${beatmapId}`);

    if (typeof rulesetId === 'number') {
      url.searchParams.append('m', rulesetId.toString());
    }

    return url.toString();
  }
  generateAvatarURL(userId) {
    return `${this.AVATARS_ROOT}/${userId}`;
  }
  generateBeatmapCoverURL(beatmapsetId) {
    return `${this.ASSETS_ROOT}/beatmaps/${beatmapsetId}/covers/cover.jpg`;
  }
  generateBeatmapThumbnailURL(beatmapsetId) {
    return `${this.ASSETS_ROOT}/beatmaps/${beatmapsetId}/covers/list.jpg`;
  }
}

class URLScanner {
  constructor() {
    this.RAW_ID_REGEX = /^[0-9]+$/;
    this.MULTIPLE_ID_REGEX = /[0-9]+/g;
  }
  hasServerURL(text) {
    return !!text?.split(' ')?.find((arg) => this.isServerURL(arg));
  }
  hasUserURL(text) {
    return !!text?.split(' ')?.find((arg) => this.isUserURL(arg));
  }
  hasBeatmapURL(text) {
    return !!text?.split(' ')?.find((arg) => this.isBeatmapURL(arg));
  }
  hasScoreURL(text) {
    return !!text?.split(' ')?.find((arg) => this.isScoreURL(arg));
  }
  isServerURL(url) {
    if (!url) {
      return false;
    }

    return this.BASE_REGEX.test(url);
  }
  isUserURL(url) {
    if (!url) {
      return false;
    }

    return this.USER_REGEX.test(url);
  }
  isBeatmapURL(url) {
    if (!url) {
      return false;
    }

    return this.BEATMAP_REGEX.test(url);
  }
  isScoreURL(url) {
    if (!url) {
      return false;
    }

    return this.SCORE_REGEX.test(url);
  }
  getRulesetIdFromURL(url) {
    if (!url || !this.isServerURL(url)) {
      return null;
    }

    const params = new URL(url).searchParams;
    const mode = params.get('m') ?? params.get('mode');

    if (mode === '1' || url.includes('taiko')) {
      return 1;
    }

    if (mode === '2' || url.includes('fruits')) {
      return 2;
    }

    if (mode === '3' || url.includes('mania')) {
      return 3;
    }

    return 0;
  }
  getBeatmapIdFromURL(url) {
    if (!url) {
      return 0;
    }

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    const regex = this.MULTIPLE_ID_REGEX;

    if (this.isBeatmapURL(url)) {
      const parsedURL = new URL(url);
      const path = parsedURL.pathname + parsedURL.hash;
      const match = path.match(regex);

      return parseInt(match[match.length - 1]);
    }

    return 0;
  }
  getScoreIdFromURL(url) {
    if (!url) {
      return 0;
    }

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    const regex = this.MULTIPLE_ID_REGEX;

    if (this.isScoreURL(url)) {
      const match = url.match(regex);

      return parseInt(match[match.length - 1]);
    }

    return 0;
  }
}

function sortUserBest(scores, order = 2) {
  switch (order) {
    case 0:
      return scores.sort((a, b) => {
        return (a.beatmap?.starRating ?? 0) - (b.beatmap?.starRating ?? 0);
      });
    case 1:
      return scores.sort((a, b) => {
        return (b.beatmap?.starRating ?? 0) - (a.beatmap?.starRating ?? 0);
      });
    case 3:
      return scores.sort((a, b) => (b.pp ?? 0) - (a.pp ?? 0));
    case 4:
      return scores.sort((a, b) => Number(a.date) - Number(b.date));
    case 5:
      return scores.sort((a, b) => Number(b.date) - Number(a.date));
    case 6:
      return scores.sort((a, b) => a.accuracy - b.accuracy);
    case 7:
      return scores.sort((a, b) => b.accuracy - a.accuracy);
  }

  return scores.sort((a, b) => (a.pp ?? 0) - (b.pp ?? 0));
}

function getRulesetId(input) {
  const value = typeof input === 'string' ? input.toLowerCase() : input;

  switch (value) {
    case 0:
    case 'standard':
    case 'std':
    case 'osu': return 0;
    case 1:
    case 'taiko': return 1;
    case 2:
    case 'ctb':
    case 'catch':
    case 'fruits': return 2;
    case 3:
    case 'mania': return 3;
  }

  throw new Error('Unknown ruleset!');
}

function getRulesetShortname(input) {
  switch (input) {
    case 0: return 'osu';
    case 1: return 'taiko';
    case 2: return 'fruits';
    case 3: return 'mania';
  }

  throw new Error('Unknown ruleset!');
}

function getRuleset(input) {
  const rulesetId = getRulesetId(input);

  switch (rulesetId) {
    case 0: return new StandardRuleset();
    case 1: return new TaikoRuleset();
    case 2: return new CatchRuleset();
    case 3: return new ManiaRuleset();
  }
}

class BanchoAuthTokens extends AuthTokens {
  constructor(tokens) {
    super();

    const expiresIn = (tokens?.expires_in ?? 0) * 1000;

    this.expiresAt = new Date(Date.now() + expiresIn);
    this.accessToken = tokens?.access_token ?? '';
    this.refreshToken = tokens?.refresh_token ?? '';
    this.type = tokens?.token_type ?? '';
  }
}

class BanchoBeatmapInfo extends BeatmapInfo {
  constructor(other) {
    super();

    const full = other;

    this.id = other.id;
    this.beatmapsetId = other.beatmapset_id;
    this.creatorId = other.beatmapset?.user_id || other?.user_id || this.creatorId;
    this.creator = other.beatmapset?.creator ?? this.creator;
    this.title = other.beatmapset?.title ?? this.title;
    this.artist = other.beatmapset?.artist ?? this.artist;
    this.favourites = other.beatmapset?.favourite_count ?? this.favourites;
    this.passcount = full.passcount ?? this.passcount;
    this.playcount = full.playcount ?? this.playcount;
    this.status = full.ranked ?? this.status;
    this.version = other.version;
    this.hittable = full.count_circles ?? this.hittable;

    if (full.mode_int === 3) {
      this.holdable = full.count_sliders ?? this.holdable;
    }
    else {
      this.slidable = full.count_sliders ?? this.slidable;
      this.spinnable = full.count_spinners ?? this.spinnable;
    }

    this.length = other.total_length;
    this.bpmMode = full.bpm ?? this.bpmMode;
    this.bpmMin = this.bpmMax = this.bpmMode;
    this.circleSize = full.cs ?? this.circleSize;
    this.approachRate = full.ar ?? this.approachRate;
    this.overallDifficulty = full.accuracy ?? this.overallDifficulty;
    this.drainRate = full.drain ?? this.drainRate;
    this.starRating = other.difficulty_rating;
    this.maxCombo = other.max_combo ?? this.maxCombo;
    this.rulesetId = full.mode_int ?? this.rulesetId;
    this.isConvert = full.convert ?? this.isConvert;
    this.deletedAt = full.deleted_at
      ? new Date(full.deleted_at) : this.deletedAt;

    this.updatedAt = full.last_updated
      ? new Date(full.last_updated) : this.updatedAt;
  }
}

class BanchoCatchDifficultyAttributes extends CatchDifficultyAttributes {
  constructor(other, mods) {
    const ruleset = new CatchRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);
    this.maxCombo = other?.max_combo ?? 0;
    this.approachRate = other?.approach_rate ?? 0;
  }
}

class BanchoManiaDifficultyAttributes extends ManiaDifficultyAttributes {
  constructor(other, mods) {
    const ruleset = new ManiaRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);
    this.maxCombo = other.max_combo ?? 0;
    this.greatHitWindow = other.great_hit_window ?? 0;
    this.scoreMultiplier = other.score_multiplier ?? 0;
  }
}

class BanchoOsuDifficultyAttributes extends StandardDifficultyAttributes {
  constructor(other, mods) {
    const ruleset = new StandardRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);
    this.maxCombo = other.max_combo ?? 0;
    this.aimStrain = other.aim_difficulty ?? 0;
    this.speedStrain = other.speed_difficulty ?? 0;
    this.flashlightRating = other.flashlight_difficulty ?? 0;
    this.sliderFactor = other.slider_factor ?? 0;
    this.approachRate = other.approach_rate ?? 0;
    this.overallDifficulty = other.overall_difficulty ?? 0;
  }
}

class BanchoScoreInfo extends ScoreInfo {
  constructor(other) {
    super();
    this.id = other.id;
    this.totalScore = other.score;
    this.pp = other.pp ?? this.pp;
    this.accuracy = other.accuracy ?? this.accuracy;
    this.rank = other.rank;
    this.maxCombo = other.max_combo;
    this.passed = other.passed;
    this.perfect = other.perfect;
    this.userId = other.user_id;
    this.username = other.user?.username ?? this.username;
    this.rulesetId = other.mode_int ?? this.rulesetId;
    this.ruleset = getRuleset(this.rulesetId);
    this.mods = this.ruleset.createModCombination(other.mods.join(''));

    if (other.beatmap) {
      this.beatmap = new BanchoBeatmapInfo(other.beatmap);
    }

    this.beatmapId = other.beatmap?.id ?? this.beatmapId;
    this.date = new Date(other.created_at ?? Date.now());
    this.countGeki = other.statistics.count_geki;
    this.countKatu = other.statistics.count_katu;
    this.count300 = other.statistics.count_300;
    this.count100 = other.statistics.count_100;
    this.count50 = other.statistics.count_50;
    this.countMiss = other.statistics.count_miss;
  }
}

class BanchoTaikoDifficultyAttributes extends TaikoDifficultyAttributes {
  constructor(other, mods) {
    const ruleset = new TaikoRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);
    this.maxCombo = other.max_combo ?? 0;
    this.staminaStrain = other.stamina_difficulty ?? 0;
    this.rhythmStrain = other.rhythm_difficulty ?? 0;
    this.colourStrain = other.colour_difficulty ?? 0;
    this.approachRate = other.approach_rate ?? 0;
    this.greatHitWindow = other.great_hit_window ?? 0;
  }
}

class BanchoUserInfo extends UserInfo {
  constructor(other) {
    super();

    const full = other;
    const rulesetId = getRulesetId(full.playmode);

    this.countryCode = other.country_code;
    this.id = other.id;
    this.isActive = other.is_active;
    this.isBot = other.is_bot;
    this.isDeleted = other.is_deleted;
    this.isOnline = other.is_online;
    this.isSupporter = other.is_supporter;
    this.username = other.username;
    this.playmode = rulesetId ?? this.playmode;
    this.lastVisitAt = other.last_visit
      ? new Date(other.last_visit) : null;
  }
}

class BanchoURLGenerator extends URLGenerator {
  constructor() {
    super(...arguments);
    this.SERVER_ROOT = 'https://osu.ppy.sh';
    this.API_ROOT = `${this.SERVER_ROOT}/api/v2`;
    this.TOKEN_ROOT = `${this.SERVER_ROOT}/oauth/token`;
    this.AUTHORIZE_ROOT = `${this.SERVER_ROOT}/oauth/authorize`;
  }
  generateBeatmapsetURL(beatmapsetId) {
    return `${this.SERVER_ROOT}/s/${beatmapsetId}`;
  }
  generateTokenURL() {
    return this.TOKEN_ROOT;
  }
  generateAuthLink(state) {
    const query = new URLSearchParams({
      client_id: process.env.OSU_CLIENT_ID,
      redirect_uri: process.env.OSU_REDIRECT_URI,
      response_type: 'code',
    });

    if (state) {
      query.append('state', state);
    }

    return `${this.AUTHORIZE_ROOT}?${query}`;
  }
  generateBeatmapInfoURL(options) {
    const { beatmapId, hash } = options;
    const base = this.API_ROOT;
    const query = new URLSearchParams();

    if (hash) {
      query.append('checksum', hash);
    }

    if (beatmapId) {
      query.append('id', beatmapId.toString());
    }

    return `${base}/beatmaps/lookup?${query}`;
  }
  generateBeatmapsetSearchURL(options) {
    const { search } = options;
    const base = this.API_ROOT;

    return `${base}/beatmapsets/search?q=${search}&s=any`;
  }
  generateScoreInfoURL(options) {
    const { scoreId, mode } = options;
    const ruleset = getRulesetShortname(mode);

    return `${this.API_ROOT}/scores/${ruleset}/${scoreId}`;
  }
  generateUserBestURL(options) {
    return this._generateUserScoresURL(options, 0);
  }
  generateUserRecentURL(options) {
    return this._generateUserScoresURL(options, 0);
  }
  generateUserFirstsURL(options) {
    return this._generateUserScoresURL(options, 1);
  }
  _generateUserScoresURL(options, type) {
    const { user, mode, limit, offset } = options ?? {};
    const base = this.API_ROOT;
    const query = new URLSearchParams();

    if (mode) {
      query.append('mode', mode.toString());
    }

    if (limit) {
      query.append('limit', limit.toString());
    }

    if (offset) {
      query.append('offset', offset.toString());
    }

    return `${base}/users/${user}/scores/${type}?${query}`;
  }
  generateBeatmapScoresURL(options) {
    const { beatmapId, user, mode, mods } = options ?? {};
    const base = user ? this.API_ROOT : this.SERVER_ROOT;
    const query = new URLSearchParams();

    if (mode) {
      query.append('mode', mode.toString());
    }

    if (mods) {
      const acronyms = mods.match(/.{1,2}/g);

      acronyms?.forEach((acronym) => query.append('mods[]', acronym));
    }

    let url = `${base}/beatmaps/${beatmapId}/scores`;

    if (user) {
      url += `/users/${user}/all`;
    }

    return `${url}?${query}`;
  }
  generateUserInfoURL(options) {
    const { user, mode } = options;

    return `${this.API_ROOT}/users/${user}/${mode ?? 'osu'}?key=in`;
  }
  generateDifficultyURL(options) {
    const { beatmapId } = options;

    return `${this.API_ROOT}/beatmaps/${beatmapId}/attributes`;
  }
}

function searchBeatmap(beatmapsets, query) {
  if (!beatmapsets || !query) {
    return null;
  }

  const keywords = query.toLowerCase().split(' ');

  for (const beatmapset of beatmapsets) {
    if (!beatmapset.beatmaps) {
      continue;
    }

    const beatmaps = beatmapset.beatmaps;
    const title = beatmapset.title.toLowerCase();
    const artist = beatmapset.artist.toLowerCase();
    const creator = beatmapset.creator.toLowerCase();
    const tags = beatmapset.tags.toLowerCase();

    for (const beatmap of beatmaps) {
      beatmap.beatmapset = beatmapset;

      const hasSameId = parseInt(keywords[0]) === beatmap.id;

      if (keywords.length === 1 && hasSameId) {
        return beatmap;
      }

      const hasSameHash = keywords[0] === beatmap.checksum?.toLowerCase();

      if (keywords.length === 1 && hasSameHash) {
        return beatmap;
      }

      const version = beatmap.version.toLowerCase();
      const targetName = `${artist} - ${title} (${creator}) [${version}] ${tags}`;

      if (hasAllKeywords(targetName, keywords)) {
        return beatmap;
      }
    }
  }

  if (beatmapsets.length && beatmapsets[0].beatmaps?.length) {
    return beatmapsets[0].beatmaps.sort((a, b) => b.playcount - a.playcount)[0];
  }

  return null;
}

function hasAllKeywords(text, keywords) {
  for (const keyword of keywords) {
    if (!text.includes(keyword)) {
      return false;
    }
  }

  return true;
}

class BanchoAPIClient extends APIClientWithOAuth {
  constructor() {
    super(...arguments);
    this.urlGenerator = new BanchoURLGenerator();
    this._users = new Map();
  }
  async authorize() {
    if (this.isAuthorized) {
      return true;
    }

    if (!this._clientId || !this._clientSecret) {
      throw new Error('Wrong credentials! Cannot authorize to the API!');
    }

    const url = this.urlGenerator.generateTokenURL();
    const data = {
      client_id: this._clientId,
      client_secret: this._clientSecret,
      grant_type: 'client_credentials',
      scope: 'public',
    };

    try {
      const res = await axios.post(url, data, this.config);

      if (res.status === 200) {
        this._tokens = new BanchoAuthTokens(res.data);

        return true;
      }

      throw new Error('Cannot authorize to the API!');
    }
    catch {
      return false;
    }
  }
  async getBeatmap(options) {
    if (options?.beatmapId || options?.hash) {
      const url = this.urlGenerator.generateBeatmapInfoURL(options);
      const response = await this._request({ url });

      if (response.data === null) {
        return null;
      }

      return new BanchoBeatmapInfo(response.data);
    }

    if (options?.search) {
      const url = this.urlGenerator.generateBeatmapsetSearchURL(options);
      const response = await this._request({ url });

      if (response.data === null) {
        return null;
      }

      const targetBeatmap = searchBeatmap(response.data.beatmapsets, options?.search);

      if (!targetBeatmap) {
        return null;
      }

      return new BanchoBeatmapInfo(targetBeatmap);
    }

    return null;
  }
  async getScore(options) {
    if (!options?.scoreId) {
      return null;
    }

    const url = this.urlGenerator.generateScoreInfoURL(options);
    const response = await this._request({ url });

    if (response.data === null) {
      return null;
    }

    return new BanchoScoreInfo(response.data);
  }
  async getLeaderboard(options) {
    if (!options?.beatmapId) {
      return [];
    }

    options = { ...options };

    if (options.user) {
      options.user = await this._getUserId(options.user);
    }

    const url = this.urlGenerator.generateBeatmapScoresURL(options);

    return this._getScores(url);
  }
  async getUserBest(options) {
    if (!options?.user) {
      return [];
    }

    const url = this.urlGenerator.generateUserBestURL({
      ...options,
      user: await this._getUserId(options.user),
    });

    return this._getScores(url);
  }
  async getUserRecent(options) {
    if (!options?.user) {
      return [];
    }

    const url = this.urlGenerator.generateUserRecentURL({
      ...options,
      user: await this._getUserId(options.user),
    });

    return this._getScores(url);
  }
  async getUser(options) {
    if (!options?.user) {
      return null;
    }

    const url = this.urlGenerator.generateUserInfoURL(options);
    const response = await this._request({ url });

    if (response.data === null) {
      return null;
    }

    return new BanchoUserInfo(response.data);
  }
  async getDifficulty(options) {
    if (!options?.beatmapId) {
      return null;
    }

    const url = this.urlGenerator.generateDifficultyURL(options);
    const data = {
      mods: options.mods?.toString(),
      ruleset_id: options.mode,
    };
    const response = await this._request({
      method: 'POST',
      data,
      url,
    });

    if (response.data === null) {
      return null;
    }

    const attributes = response.data.attributes;

    return this._createAttributes(attributes, options);
  }
  _createAttributes(data, options) {
    const mods = options.mods ?? 0;
    const mode = options.mode;

    switch (mode) {
      case 1:
        return new BanchoTaikoDifficultyAttributes(data, mods);
      case 2:
        return new BanchoCatchDifficultyAttributes(data, mods);
      case 3:
        return new BanchoManiaDifficultyAttributes(data, mods);
    }

    return new BanchoOsuDifficultyAttributes(data, mods);
  }
  async _getScores(url) {
    const response = await this._request({ url });

    if (response.data === null) {
      return [];
    }

    const scores = response.data.scores;

    return scores.map((s) => new BanchoScoreInfo(s));
  }
  async _getUserId(target) {
    if (this._users.has(target)) {
      return this._users.get(target);
    }

    const targetId = parseInt(target) || 0;

    if (targetId !== 0 && this._users.has(targetId)) {
      return this._users.get(targetId);
    }

    const user = await this.getUser({ user: target });

    if (user) {
      this._users.set(user.username, user.id);
      this._users.set(user.id, user.id);

      return user.id;
    }

    return 0;
  }
}

class BanchoURLScanner extends URLScanner {
  constructor() {
    super(...arguments);
    this.SERVER_NAME = 'Bancho';
    this.BASE_REGEX = new RegExp(''
            + /^((http|https):\/\/)?/.source
            + /(old|osu).ppy.sh/.source);

    this.USER_REGEX = new RegExp(''
            + this.BASE_REGEX.source
            + /\/(u|users)/.source
            + /\/[A-z0-9]+/.source
            + /(#(osu|taiko|fruits|mania)|\/(osu|taiko|fruits|mania)){0,1}$/.source);

    this.BEATMAP_REGEX = new RegExp(''
            + this.BASE_REGEX.source
            + /\/(b|beatmaps)/.source
            + /\/[0-9]+/.source
            + /((\?mode=(osu|taiko|fruits|mania))|(\?m=(0|1|2|3))){0,1}$/.source);

    this.BEATMAPSET_REGEX = new RegExp(''
            + this.BASE_REGEX.source
            + /\/(s|beatmapsets)/.source
            + /\/[0-9]+/.source
            + /(#(osu|taiko|fruits|mania)){0,1}$/.source);

    this.BEATMAP_WITH_SET_REGEX = new RegExp(''
            + this.BASE_REGEX.source
            + /\/(s|beatmapsets)/.source
            + /\/[0-9]+/.source
            + /(#(osu|taiko|fruits|mania)){0,1}/.source
            + /\/[0-9]+$/.source);

    this.SCORE_REGEX = new RegExp(''
            + this.BASE_REGEX.source
            + /\/scores/.source
            + /\/(osu|taiko|fruits|mania)/.source
            + /\/[0-9]+$/.source);
  }
  hasBeatmapsetURL(text) {
    return !!text?.split(' ')?.find((arg) => this.isBeatmapsetURL(arg));
  }
  isBeatmapURL(url) {
    if (!url) {
      return false;
    }

    return this.BEATMAP_REGEX.test(url)
            || this.BEATMAP_WITH_SET_REGEX.test(url);
  }
  isBeatmapURLWithRuleset(url) {
    if (!url) {
      return false;
    }

    const isBeatmapURL = this.BEATMAP_REGEX.test(url)
            || this.BEATMAP_WITH_SET_REGEX.test(url);
    const params = new URL(url).searchParams;
    const mode = params.get('m') ?? params.get('mode');
    const hasRuleset = mode === '0' || url.includes('osu')
            || mode === '1' || url.includes('taiko')
            || mode === '2' || url.includes('fruits')
            || mode === '3' || url.includes('mania');

    return isBeatmapURL && hasRuleset;
  }
  isBeatmapsetURL(url) {
    if (!url) {
      return false;
    }

    return this.BEATMAPSET_REGEX.test(url);
  }
  getBeatmapsetIdFromURL(url) {
    if (!url) {
      return 0;
    }

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    const regex = this.MULTIPLE_ID_REGEX;

    if (this.isBeatmapsetURL(url)) {
      const match = url.match(regex);

      return parseInt(match[0]);
    }

    return 0;
  }
}

function getServerName(input) {
  if (new BanchoURLScanner().hasServerURL(input)) {
    return 'Bancho';
  }

  return null;
}

class APIFactory {
  getAPIClient(server) {
    if (server === null || server === undefined) {
      return BanchoAPIClient.getInstance();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari':
      case 'bancho': return BanchoAPIClient.getInstance();
    }

    throw new Error('This server is not found or not supported!');
  }
  addCredentials(server, clientId, clientSecret) {
    const client = this.getAPIClient(server);

    if (!client.addCredentials) {
      throw new Error('This server API does not require any authorization!');
    }

    client.addCredentials(clientId, clientSecret);
  }
  createURLScanner(server) {
    if (server === null || server === undefined) {
      return new BanchoURLScanner();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari':
      case 'bancho': return new BanchoURLScanner();
    }

    throw new Error('This server is not found or not supported!');
  }
  createURLGenerator(server) {
    if (server === null || server === undefined) {
      return new BanchoURLGenerator();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari':
      case 'bancho': return new BanchoURLGenerator();
    }

    throw new Error('This server is not found or not supported!');
  }
}
let APIFactory$1 = new APIFactory();

export { APICache, APIClient, APIClientWithOAuth, APIFactory$1 as APIFactory, AuthTokens, BanchoAPIClient, BanchoAuthTokens, BanchoBeatmapInfo, BanchoCatchDifficultyAttributes, BanchoManiaDifficultyAttributes, BanchoOsuDifficultyAttributes, BanchoScoreInfo, BanchoTaikoDifficultyAttributes, BanchoURLGenerator, BanchoURLScanner, BanchoUserInfo, URLGenerator, URLScanner, getRuleset, getRulesetId, getRulesetShortname, getServerName, searchBeatmap, sortUserBest };
