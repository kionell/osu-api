import axios from 'axios';
import type { DifficultyAttributes } from 'osu-classes';

import {
  APIClientWithOAuth,
  GameMode,
  type ILeaderboardRequestOptions,
  type IScoreListRequestOptions,
  type IUserRequestOptions,
  type IBeatmapRequestOptions,
  type IDifficultyRequestOptions,
  type IScoreRequestOptions,
  type IHasBeatmaps,
  type IHasAttributes,
  type IHasLeaderboard,
  type IHasRecent,
  type IHasScores,
  type IHasTop,
  type IHasUsers,
} from '@Core';

import {
  BanchoAuthTokens,
  BanchoBeatmapInfo,
  BanchoScoreInfo,
  BanchoUserInfo,
  BanchoOsuDifficultyAttributes,
  BanchoTaikoDifficultyAttributes,
  BanchoCatchDifficultyAttributes,
  BanchoManiaDifficultyAttributes,
} from './Classes';

import { BanchoURLGenerator } from './BanchoURLGenerator';
import { searchBeatmap } from './Utils';

/**
 * A wrapper for Bancho API v2.
 */
export class BanchoAPIClient extends APIClientWithOAuth implements
  IHasAttributes, IHasBeatmaps, IHasLeaderboard,
  IHasRecent, IHasScores, IHasTop, IHasUsers {

  /**
   * Bancho URL generator.
   */
  private readonly _urlGenerator = new BanchoURLGenerator();

  /**
   * Cached pairs of username & user ID.
   */
  private _users = new Map<string | number, number>();

  /**
   * Authorizes to the API.
   * @returns If authorization was successful or not.
   */
  async authorize(): Promise<boolean> {
    if (this.isAuthorized) return true;

    if (!this._clientId || !this._clientSecret) {
      throw new Error('Wrong credentials! Cannot authorize to the Bancho API!');
    }

    // https://osu.ppy.sh/oauth/token
    const url = this._urlGenerator.generateTokenURL();

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

      throw new Error('Cannot authorize to the Bancho API!');
    }
    catch {
      return false;
    }
  }

  async getBeatmap(options?: IBeatmapRequestOptions): Promise<BanchoBeatmapInfo | null> {
    if (options?.beatmapId || options?.hash) {
      const url = this._urlGenerator.generateBeatmapInfoURL(options);
      const response = await this._request({ url });

      if (response.data === null) return null;

      return new BanchoBeatmapInfo(response.data);
    }

    if (options?.search) {
      const url = this._urlGenerator.generateBeatmapsetSearchURL(options);
      const response = await this._request({ url });

      if (response.data === null) return null;

      const targetBeatmap = searchBeatmap(response.data.beatmapsets, options?.search);

      if (!targetBeatmap) return null;

      return new BanchoBeatmapInfo(targetBeatmap);
    }

    return null;
  }

  async getScore(options?: IScoreRequestOptions): Promise<BanchoScoreInfo | null> {
    if (!options?.scoreId) return null;

    const url = this._urlGenerator.generateScoreInfoURL(options);
    const response = await this._request({ url });

    if (response.data === null) return null;

    return new BanchoScoreInfo(response.data);
  }

  async getLeaderboard(options?: ILeaderboardRequestOptions): Promise<BanchoScoreInfo[]> {
    if (!options?.beatmapId) return [];

    options = { ...options };

    if (options.user) {
      options.user = await this._getUserId(options.user);
    }

    const url = this._urlGenerator.generateBeatmapScoresURL(options);

    return this._getScores(url);
  }

  async getUserBest(options?: IScoreListRequestOptions): Promise<BanchoScoreInfo[]> {
    if (!options?.user) return [];

    const url = this._urlGenerator.generateUserBestURL({
      ...options,
      user: await this._getUserId(options.user),
    });

    return this._getScores(url);
  }

  async getUserRecent(options?: IScoreListRequestOptions): Promise<BanchoScoreInfo[]> {
    if (!options?.user) return [];

    const url = this._urlGenerator.generateUserRecentURL({
      ...options,
      user: await this._getUserId(options.user),
    });

    return this._getScores(url);
  }

  async getUser(options?: IUserRequestOptions): Promise<BanchoUserInfo | null> {
    if (!options?.user) return null;

    const url = this._urlGenerator.generateUserInfoURL(options);
    const response = await this._request({ url });

    if (response.data === null) return null;

    return new BanchoUserInfo(response.data);
  }

  async getDifficulty(options?: IDifficultyRequestOptions): Promise<DifficultyAttributes | null> {
    if (!options?.beatmapId) return null;

    const url = this._urlGenerator.generateDifficultyURL(options);
    const data = {
      mods: options.mods?.toString(),
      ruleset_id: options.mode,
    };

    const response = await this._request({
      method: 'POST',
      data,
      url,
    });

    if (response.data === null) return null;

    const attributes = response.data.attributes;

    return this._createAttributes(attributes, options);
  }

  /**
   * Creates adapted difficulty attributes for specific ruleset.
   * @param data Response data with difficulty information. 
   * @param options Difficulty request options.
   * @returns Adapted difficulty attributes.
   */
  private _createAttributes(data: any, options: IDifficultyRequestOptions): DifficultyAttributes {
    const mods = options.mods ?? 0;
    const mode = options.mode;

    switch (mode) {
      case GameMode.Taiko:
        return new BanchoTaikoDifficultyAttributes(data, mods);

      case GameMode.Fruits:
        return new BanchoCatchDifficultyAttributes(data, mods);

      case GameMode.Mania:
        return new BanchoManiaDifficultyAttributes(data, mods);
    }

    return new BanchoOsuDifficultyAttributes(data, mods);
  }

  /**
   * Performs a request to the API to get a list of scores.
   * @param url URL to the list of scores.
   * @returns A list of adapted scores.
   */
  private async _getScores(url: string): Promise<BanchoScoreInfo[]> {
    const response = await this._request({ url });

    if (response.data === null) return [];

    const scores = response.data.scores as any[];

    return scores.map((s) => new BanchoScoreInfo(s));
  }

  /**
   * This exists only because not all endpoints can work with usernames.
   * Although this client performs caching, new users 
   * still require an additional request to the API.
   * @param target Username or user ID.
   * @returns User ID.
   */
  private async _getUserId(target: string | number): Promise<number> {
    if (this._users.has(target)) {
      return this._users.get(target) as number;
    }

    const targetId = parseInt(target as string) || 0;

    if (targetId !== 0 && this._users.has(targetId)) {
      return this._users.get(targetId) as number;
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
