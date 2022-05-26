import { AuthTokens } from '@Core';
import type { IBanchoAuthTokens } from '../Interfaces';

export class BanchoAuthTokens extends AuthTokens {
  constructor(tokens: IBanchoAuthTokens) {
    super();

    // Convert seconds to milliseconds
    const expiresIn = (tokens?.expires_in ?? 0) * 1000;

    this.expiresAt = new Date(Date.now() + expiresIn);
    this.accessToken = tokens?.access_token ?? '';
    this.refreshToken = tokens?.refresh_token ?? '';
    this.type = tokens?.token_type ?? '';
  }
}
