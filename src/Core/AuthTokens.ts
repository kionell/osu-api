export abstract class AuthTokens {
  /**
   * OAuth access token.
   */
  accessToken = '';

  /**
   * OAuth refresh token.
   */
  refreshToken = '';

  /**
   * OAuth token type.
   */
  type = '';

  /**
   * The date when this token expires.
   */
  expiresAt: Date = new Date();

  /**
   * The time after which this token will expire. 
   */
  get expiresIn(): number {
    const difference = this.expiresAt.getTime() - Date.now();

    return Math.trunc(difference / 1000);
  }

  /**
   * Whether this token expired or not.
   */
  get isExpired(): boolean {
    return this.expiresIn < 10;
  }

  /**
   * Whether this token valid or not. 
   */
  get isValid(): boolean {
    return this.accessToken.length > 0 && !this.isExpired;
  }
}
