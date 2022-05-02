import type { ICachedResponse } from './ICachedResponse';

/**
 * An API cache. 
 */
export class APICache extends Map<string, ICachedResponse> {
  /**
   * Adds a new element to the cache. Removes it after a certain time if needed.
   * @param key The key that will be used to identify this response.
   * @param value The response value.
   * @returns Reference to this cache.
   */
  set(key: string, value: ICachedResponse): this {
    super.set(key, value);

    /**
     * If expiration time was set then add timeout for deletion.
     */
    if (value.expiresIn) {
      setTimeout(() => super.delete(key), value.expiresIn);
    }

    return this;
  }
}
