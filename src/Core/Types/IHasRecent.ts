import type { IScoreInfo } from 'osu-classes';
import type { IScoreListRequestOptions } from '../Options';

/**
 * API that gives access to the recent scores of a user.
 */
export interface IHasRecent {
  /**
   * Performs a request to the API to get user recent scores.
   * @param options Score request options.
   * @returns The list of user's recent scores.
   */
  getUserRecent(options?: IScoreListRequestOptions): Promise<IScoreInfo[]>;
}
