import type { DifficultyAttributes } from 'osu-classes';
import type { IDifficultyRequestOptions } from '../Options';

/**
 * API that gives access to the difficulty attributes.
 */
export interface IHasAttributes {
  /**
   * Performs a request to the API to get difficulty attributes.
   * @param options Difficulty request options.
   * @returns Difficulty attributes or null.
   */
  getDifficulty(options?: IDifficultyRequestOptions): Promise<DifficultyAttributes | null>;
}
