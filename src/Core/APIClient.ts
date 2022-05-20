import md5 from 'md5';

import axios, {
  type Method,
  type AxiosRequestConfig,
} from 'axios';

import { APICache } from './APICache';
import type { IAPIResponse } from './IAPIResponse';

/**
 * An API client.
 */
export abstract class APIClient {
  /**
   * An API cache.
   */
  cache: APICache = new APICache();

  /**
   * Singleton instance of a client.
   */
  private static _clientInstance: APIClient;

  protected constructor() {
    return;
  }

  /**
   * @returns Instance of an API client.
   */
  static getInstance(): APIClient {
    if (!this._clientInstance) {
      const APIClient = this.constructor as new () => APIClient;

      this._clientInstance = new APIClient();
    }

    return this._clientInstance;
  }

  /**
   * Performs a request to the endpoint of API.
   * The response can be taken from the cache or obtained directly from the API.
   * @param url Request URL.
   * @param method Request method.
   * @param data Request data.
   * @returns API response or cached response.
   */
  protected async _request(url: string, method?: Method, data?: unknown): Promise<IAPIResponse> {
    const hash = md5(url);
    const cached = this.cache.get(hash);

    if (cached) return cached;

    try {
      const response = await axios.request({
        ...this.config,
        url,
        method,
        data,
      });

      const result: IAPIResponse = {
        data: response.status === 200 ? response.data : null,
        url,
      };

      if (method === 'POST' || method === 'post') return result;

      this.cache.set(hash, {
        ...result,
        expiresIn: 30000, // 30 seconds
      });

      return result;
    }
    catch {
      return { data: null, url };
    }
  }

  /**
   * Default API request config.
   */
  get config(): AxiosRequestConfig {
    return {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };
  }
}
