import md5 from 'md5';

import axios, {
  type Method,
  type AxiosRequestConfig,
  AxiosError,
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
   * @param url Request URL.
   * @param method Request method.
   * @param data Request data.
   * @returns API response or cached response.
   */
  protected async _request(url: string, method?: Method, data?: unknown): Promise<IAPIResponse> {
    try {
      const hash = md5(url);
      const cached = this.cache.get(hash);

      if (cached) return cached;

      const response = await axios.request({
        ...this.config,
        url,
        method,
        data,
      });

      const result: IAPIResponse = {
        status: response.status,
        data: response.data,
        error: null,
        url,
      };

      if (method === 'POST' || method === 'post') return result;

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
        status: response?.status ?? 500,
        data: null,
        error,
        url,
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
