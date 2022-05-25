import md5 from 'md5';

import axios, {
  type AxiosRequestConfig,
  AxiosError,
} from 'axios';

import { APICache } from './APICache';
import type { IAPIResponse } from './IAPIResponse';

/**
 * Universal request config.
 */
export type RequestConfig = Required<Pick<AxiosRequestConfig, 'url' | 'method'>> & AxiosRequestConfig;

/**
 * An API client.
 */
export abstract class APIClient {
  /**
   * An API cache.
   */
  cache: APICache = new APICache();

  /**
   * Singleton instances of different clients.
   */
  private static _instances = new Map<new () => APIClient, APIClient>();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor() {}

  static getInstance(): APIClient {
    const constructor = this.prototype.constructor as new () => APIClient;
    const existingInstance = this._instances.get(constructor);

    if (existingInstance) return existingInstance;

    const newInstance = new constructor();

    this._instances.set(constructor, newInstance);

    return newInstance;
  }

  /**
   * Performs a request to the endpoint of API.
   * The response can be taken from the cache or obtained directly from the API.
   * @param config Request config.
   * @returns API response or cached response.
   */
  protected async _request(config: RequestConfig): Promise<IAPIResponse> {
    try {
      const hash = md5(config.url);
      const cached = this.cache.get(hash);

      if (cached) return cached;

      const response = await axios.request(config);

      const result: IAPIResponse = {
        url: config.url,
        status: response.status,
        data: response.data,
        error: null,
      };

      this.cache.set(hash, {
        ...result,
        expiresIn: 30000, // 30 seconds
      });

      return result;
    }
    catch (err: unknown) {
      const axiosError = err as AxiosError;

      const response = axiosError?.response ?? null;
      const data = response?.data as any ?? null;

      let error = data?.error
        ?? data?.message
        ?? response?.statusText
        ?? axiosError?.message;

      if (axiosError?.code === 'ECONNREFUSED') {
        error = 'Can\'t connect to API!';
      }

      if (!error) {
        error = 'An unknown error has occured!';
      }

      return {
        url: config.url,
        status: response?.status ?? 500,
        data: null,
        error,
      };
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
