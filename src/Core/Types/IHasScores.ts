import type { IScoreInfo } from 'osu-classes';
import type { IScoreRequestOptions } from '../Options';

/**
 * API that gives access to the scores.
 */
export interface IHasScores {
  /**
   * Performs a request to the API to get a score information.
   * @param options Score request options.
   * @returns Score information or null.
   */
  getScore(options?: IScoreRequestOptions): Promise<IScoreInfo | null>;
}
