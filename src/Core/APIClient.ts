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
   * Singleton instance of a client.
   */
  private static _instance: APIClient;

  constructor() {
    if (APIClient._instance) {
      return APIClient._instance;
    }

    APIClient._instance = this;
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

      return {
        error: data?.error ?? data?.message ?? response?.statusText,
        status: response?.status ?? 500,
        data: null,
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
