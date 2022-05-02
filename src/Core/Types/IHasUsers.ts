import type { IUserInfo } from 'osu-classes';
import type { IUserRequestOptions } from '../Options';

/**
 * API that gives access to the user information.
 */
export interface IHasUsers {
  /**
   * Performs a request to the API to get user info.
   * @param options User request options.
   * @returns User information or null.
   */
  getUser(options?: IUserRequestOptions): Promise<IUserInfo | null>;
}
