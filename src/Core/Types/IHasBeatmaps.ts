import type { IBeatmapInfo } from 'osu-classes';
import type { IBeatmapRequestOptions } from '../Options';

/**
 * API that gives access to the beatmap information.
 */
export interface IHasBeatmaps {
  /**
   * Performs a request to the API to get a beatmap information.
   * @param options Beatmap request options.
   * @returns Beatmap information or null.
   */
  getBeatmap(options?: IBeatmapRequestOptions): Promise<IBeatmapInfo | null>;
}
