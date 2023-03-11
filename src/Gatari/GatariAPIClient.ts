import {
  APIClient,
  type ILeaderboardRequestOptions,
  type IScoreListRequestOptions,
  type IUserRequestOptions,
  type IBeatmapRequestOptions,
  type IHasBeatmaps,
  type IHasLeaderboard,
  type IHasRecent,
  type IHasTop,
  type IHasUsers,
} from '@Core';

import {
  GatariBeatmapInfo,
  GatariScoreInfo,
  GatariUserInfo,
} from './Classes';

import { GatariURLGenerator } from './GatariURLGenerator';
import { IGatariBeatmapScore, IGatariUserBeatmapScore, IGatariUserScore } from './Interfaces';

/**
 * A wrapper for Gatari API.
 */
export class GatariAPIClient extends APIClient implements
  IHasBeatmaps, IHasLeaderboard, IHasRecent, IHasTop, IHasUsers {

  /**
   * Bancho URL generator.
   */
  private readonly _urlGenerator = new GatariURLGenerator();

  /**
   * Cached pairs of username & user ID.
   */
  private _users = new Map<string | number, number>();

  async getBeatmap(options?: IBeatmapRequestOptions): Promise<GatariBeatmapInfo | null> {
    if (options?.beatmapId) {
      const response = await this._request({
        url: this._urlGenerator.generateBeatmapInfoURL(options.beatmapId),
      });

      const data = response.data?.data;

      if (!data?.length) return null;

      return new GatariBeatmapInfo(data[0]);
    }

    return null;
  }

  async getUser(options?: IUserRequestOptions): Promise<GatariUserInfo | null> {
    if (!options?.user) return null;

    const responses = await Promise.all([
      this._request({
        url: this._urlGenerator.generateUserInfoURL(options),
      }),
      this._request({
        url: this._urlGenerator.generateUserStatsURL(options),
      }),
    ]);

    const [userInfoResponse, userStatsResponse] = responses;

    const userInfoData = userInfoResponse.data?.users;
    const userStatsData = userStatsResponse.data?.stats;

    if (!userInfoData?.length || !userStatsData) return null;

    return new GatariUserInfo(userInfoData[0], userStatsData);
  }

  async getLeaderboard(options?: ILeaderboardRequestOptions): Promise<GatariScoreInfo[]> {
    if (!options?.beatmapId) return [];

    const url = this._urlGenerator.generateBeatmapScoresURL({
      ...options,
      user: await this._getUserId(options.user ?? 0),
    });

    return this._getScores(url);
  }

  async getUserBest(options?: IScoreListRequestOptions): Promise<GatariScoreInfo[]> {
    if (!options?.user) return [];

    const url = this._urlGenerator.generateUserBestURL({
      ...options,
      user: await this._getUserId(options.user),
    });

    return this._getScores(url);
  }

  async getUserFirsts(options?: IScoreListRequestOptions): Promise<GatariScoreInfo[]> {
    if (!options?.user) return [];

    const url = this._urlGenerator.generateUserFirstsURL({
      ...options,
      user: await this._getUserId(options.user),
    });

    return this._getScores(url);
  }

  async getUserRecent(options?: IScoreListRequestOptions): Promise<GatariScoreInfo[]> {
    if (!options?.user) return [];

    const url = this._urlGenerator.generateUserRecentURL({
      ...options,
      user: await this._getUserId(options.user),
    });

    return this._getScores(url);
  }

  /**
   * Performs a request to the API to get a list of scores.
   * @param url URL to the list of scores.
   * @returns A list of adapted scores.
   */
  private async _getScores(url: string): Promise<GatariScoreInfo[]> {
    const response = await this._request({ url });

    type IGatariScore = IGatariUserScore | IGatariBeatmapScore | IGatariUserBeatmapScore;

    const data = response.data?.data ?? response.data?.scores;
    const scores = data as IGatariScore[];

    if (!scores?.length) {
      const score = response.data?.score as IGatariScore;

      return score ? [new GatariScoreInfo(score)] : [];
    }

    return scores.map((s) => new GatariScoreInfo(s));
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
