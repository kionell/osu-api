import type { AxiosRequestConfig, AxiosError, Method } from 'axios';
import type { IAPIResponse } from './IAPIResponse';
import type { AuthTokens } from './AuthTokens';
import { APIClient } from './APIClient';

export abstract class APIClientWithOAuth extends APIClient {
  /**
   * OAuth2 client ID.
   */
  protected _clientId: string | null = null;

  /**
   * OAuth2 client secret.
   */
  protected _clientSecret: string | null = null;

  /**
   * OAuth2 tokens.
   */
  protected _tokens: AuthTokens | null = null;

  /**
   * Authorize to the API.
   */
  abstract authorize(): Promise<boolean>;

  /**
    * If this client is authorized or not.
    */
  get isAuthorized(): boolean {
    return this._tokens !== null && this._tokens.isValid;
  }

  /**
   * Performs a request to the endpoint of API with pre-authorization.
   * The response can be taken from the cache or obtained directly from the API.
   * @param url Request URL.
   * @param method Request method.
   * @param data Request data.
   * @returns API response or cached response.
   */
  protected async _request(url: string, method?: Method, data?: unknown): Promise<IAPIResponse> {
    if (!this.isAuthorized) await this.authorize();

    try {
      return super._request(url, method, data);
    }
    catch (err: unknown) {
      const axiosError = err as AxiosError;
      const status = axiosError?.response?.status;

      if (status === 401 && await this.authorize()) {
        return this._request(url, method, data);
      }

      throw err;
    }
  }

  /**
   * Default API request config with authorization.
   */
  get config(): AxiosRequestConfig {
    return {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._tokens?.accessToken ?? ''}`,
      },
    };
  }
}
