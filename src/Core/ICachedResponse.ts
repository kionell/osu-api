import type { IAPIResponse } from './IAPIResponse';

/**
 * Cached API response.
 */
export interface ICachedResponse extends IAPIResponse {
  /**
   * The time in milliseconds after which this response expires.
   */
  expiresIn?: number;
}
