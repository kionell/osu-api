import type { IScoreInfo } from 'osu-classes';
import type { ILeaderboardRequestOptions } from '../Options';

/**
 * API that gives access to the beatmap scores.
 */
export interface IHasLeaderboard {
  /**
   * Performs a request to the API to get scores on a beatmap.
   * If user was specified then returns all user's scores on the beatmap.
   * Otherwise will return beatmap leaderboard scores.
   * @param options Beatmap score request options.
   * @returns The list of scores on the beatmap.
   */
  getLeaderboard(options?: ILeaderboardRequestOptions): Promise<IScoreInfo[]>;
}
