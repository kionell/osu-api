import type { IScoreInfo } from 'osu-classes';
import type { IScoreListRequestOptions } from '../Options';

/**
 * API that gives access to the recent scores of a user.
 */
export interface IHasFirsts {
  /**
   * Performs a request to the API to get a list of top 1 scores of a user.
   * @param options Score request options.
   * @returns The list of user's top 1 scores.
   */
  getUserFirsts(options?: IScoreListRequestOptions): Promise<IScoreInfo[]>;
}
