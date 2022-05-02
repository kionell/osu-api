import type { IScoreInfo } from 'osu-classes';
import type { IScoreListRequestOptions } from '../Options';

/**
 * API that gives access to the best scores of a user.
 */
export interface IHasTop {
  /**
   * Performs a request to the API to get user's best scores.
   * @param options Score request options.
   * @returns The list of user's best scores.
   */
  getUserBest(options?: IScoreListRequestOptions): Promise<IScoreInfo[]>;
}
