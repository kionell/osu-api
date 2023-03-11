import {
  URLGenerator,
  ScoreType,
  type IBeatmapRequestOptions,
  type ILeaderboardRequestOptions,
  type IDifficultyRequestOptions,
  type IScoreRequestOptions,
  type IScoreListRequestOptions,
  type IUserRequestOptions,
  getRulesetShortname,
} from '@Core';

export class BanchoURLGenerator extends URLGenerator {
  /**
   * Base link to the osu! website.
   */
  readonly SERVER_ROOT = 'https://osu.ppy.sh';

  /**
   * Base link to the osu! avatars.
   */
  readonly AVATARS_ROOT = 'https://a.ppy.sh';

  /**
   * Base link to the osu! api v2.
   */
  readonly API_ROOT = `${this.SERVER_ROOT}/api/v2`;

  /**
   * Base link to the osu! authorization tokens.
   */
  readonly TOKEN_ROOT = `${this.SERVER_ROOT}/oauth/token`;

  /**
   * Base link to the osu! authorization.
   */
  readonly AUTHORIZE_ROOT = `${this.SERVER_ROOT}/oauth/authorize`;

  generateTokenURL(): string {
    return this.TOKEN_ROOT;
  }

  generateAuthLink(state?: string): string {
    const query = new URLSearchParams({
      client_id: process.env.OSU_CLIENT_ID as string,
      redirect_uri: process.env.OSU_REDIRECT_URI as string,
      response_type: 'code',
    });

    if (state) query.append('state', state);

    return `${this.AUTHORIZE_ROOT}?${query}`;
  }

  generateBeatmapInfoURL(options: IBeatmapRequestOptions): string {
    const { beatmapId, hash } = options;

    const base = this.API_ROOT;
    const query = new URLSearchParams();

    if (hash) query.append('checksum', hash);
    if (beatmapId) query.append('id', beatmapId.toString());

    // Always use lookup mode because it is better than regular endpoint.
    return `${base}/beatmaps/lookup?${query}`;
  }

  generateBeatmapsetSearchURL(options: IBeatmapRequestOptions): string {
    return `${this.API_ROOT}/beatmapsets/search?q=${options.search}&s=any`;
  }

  generateScoreInfoURL(options: IScoreRequestOptions): string {
    const { scoreId, mode } = options;

    const ruleset = getRulesetShortname(mode);

    return `${this.API_ROOT}/scores/${ruleset}/${scoreId}`;
  }

  generateUserBestURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Best);
  }

  generateUserFirstsURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Firsts);
  }

  generateUserRecentURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Recent);
  }

  private _generateUserScoresURL(options: IScoreListRequestOptions, type: ScoreType): string {
    const { user, mode, limit, offset, includeFails } = options ?? {};

    const getDisplayScoreType = () => {
      switch (type) {
        case ScoreType.Best: return 'best';
        case ScoreType.Firsts: return 'firsts';
        case ScoreType.Recent: return 'recent';
      }
    };

    const query = new URLSearchParams();

    if (mode) query.append('mode', getRulesetShortname(mode));
    if (limit) query.append('limit', limit.toString());
    if (offset) query.append('offset', offset.toString());
    if (includeFails) query.append('include_fails', '1');

    const scoreType = getDisplayScoreType();

    return `${this.API_ROOT}/users/${user}/scores/${scoreType}?${query}`;
  }

  generateBeatmapScoresURL(options: ILeaderboardRequestOptions): string {
    const { beatmapId, user, mode, mods } = options ?? {};

    const base = user ? this.API_ROOT : this.SERVER_ROOT;
    const query = new URLSearchParams();

    if (mode) query.append('mode', getRulesetShortname(mode));

    let url = `${base}/beatmaps/${beatmapId}/scores`;

    if (user) url += `/users/${user}`;

    if (mods) {
      const acronyms = mods.match(/.{1,2}/g);

      acronyms?.forEach((acronym) => query.append('mods[]', acronym));
    }
    else {
      url += '/all';
    }

    return `${url}?${query}`;
  }

  generateUserInfoURL(options: IUserRequestOptions): string {
    const { user, mode } = options;

    const ruleset = getRulesetShortname(mode);

    return `${this.API_ROOT}/users/${user}/${ruleset}?key=in`;
  }

  generateDifficultyURL(options: IDifficultyRequestOptions): string {
    const { beatmapId } = options;

    return `${this.API_ROOT}/beatmaps/${beatmapId}/attributes`;
  }

  generateAvatarURL(userId: string | number): string {
    return userId
      ? `${this.AVATARS_ROOT}/${userId}`
      : `${this.SERVER_ROOT}/images/layout/avatar-guest.png`;
  }
}
