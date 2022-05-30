import type { AxiosRequestConfig, AxiosError } from 'axios';
import type { IAPIResponse } from './IAPIResponse';
import type { AuthTokens } from './AuthTokens';
import { APIClient, RequestConfig } from './APIClient';

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
   * Adds credentials to this API client.
   * @param clientId API client ID.
   * @param clientSecret API client secret.
   */
  addCredentials(clientId?: string, clientSecret?: string): void {
    this._clientId = clientId ?? this._clientId;
    this._clientSecret = clientSecret ?? this._clientSecret;
  }

  /**
    * If this client is authorized or not.
    */
  get isAuthorized(): boolean {
    return this._tokens !== null && this._tokens.isValid;
  }

  /**
   * Performs a request to the endpoint of API with pre-authorization.
   * The response can be taken from the cache or obtained directly from the API.
   * @param config Request config.
   * @param method Request method.
   * @param data Request data.
   * @returns API response or cached response.
   */
  protected async _request(config: RequestConfig): Promise<IAPIResponse> {
    if (!this.isAuthorized) await this.authorize();

    let attempts = 0;

    const request = async(config: RequestConfig): Promise<IAPIResponse> => {
      try {
        return super._request(config);
      }
      catch (err: unknown) {
        const axiosError = err as AxiosError;
        const status = axiosError?.response?.status;

        if (attempts < 3 && status === 401 && await this.authorize()) {
          return request(config);
        }

        attempts++;

        throw err;
      }
    };

    return await request(config);
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
