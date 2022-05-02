import {
  URLGenerator,
  ScoreType,
  type IBeatmapRequestOptions,
  type ILeaderboardRequestOptions,
  type IDifficultyRequestOptions,
  type IScoreRequestOptions,
  type IScoreListRequestOptions,
  type IUserRequestOptions,
} from '@Core';

export class BanchoURLGenerator extends URLGenerator {
  /**
   * Base link to the osu! website.
   */
  readonly SERVER_ROOT = 'https://osu.ppy.sh';

  /**
   * Base link to the osu! api v2.
   */
  readonly API_ROOT = `${this.SERVER_ROOT}/api/v2`;

  /**
   * Base link to the osu! authorization tokens.
   */
  readonly TOKEN_ROOT = `${this.SERVER_ROOT}/oauth/token`;

  /**
   * Base link to the osu! authorization.
   */
  readonly AUTHORIZE_ROOT = `${this.SERVER_ROOT}/oauth/authorize`;

  /**
   * Generates a beatmapset URL by beatmapset ID.
   * @param user Beatmapset ID.
   * @returns Generated beatmapset URL.
   */
  generateBeatmapsetURL(beatmapsetId: string | number): string {
    return `${this.SERVER_ROOT}/s/${beatmapsetId}`;
  }

  generateTokenURL(): string {
    return this.TOKEN_ROOT;
  }

  generateAuthLink(state?: string): string {
    const query = new URLSearchParams({
      client_id: process.env.OSU_CLIENT_ID as string,
      redirect_uri: process.env.OSU_REDIRECT_URI as string,
      response_type: 'code',
    });

    if (state) query.append('state', state);

    return `${this.AUTHORIZE_ROOT}?${query}`;
  }

  generateBeatmapInfoURL(options: IBeatmapRequestOptions): string {
    const { beatmapId, hash } = options;

    const base = this.API_ROOT;
    const query = new URLSearchParams();

    if (hash) query.append('checksum', hash);
    if (beatmapId) query.append('id', beatmapId.toString());

    // Always use lookup mode because it is better than regular endpoint.
    return `${base}/beatmaps/lookup?${query}`;
  }

  generateBeatmapsetSearchURL(options: IBeatmapRequestOptions): string {
    const { search } = options;

    const base = this.API_ROOT;

    return `${base}/beatmapsets/search?q=${search}&s=any`;
  }

  generateScoreInfoURL(options: IScoreRequestOptions): string {
    const { scoreId, mode } = options;

    return `${this.API_ROOT}/scores/${ mode ?? 'osu' }/${scoreId}`;
  }

  generateUserBestURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Best);
  }

  generateUserRecentURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Best);
  }

  generateUserFirstsURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Firsts);
  }

  private _generateUserScoresURL(options: IScoreListRequestOptions, type: ScoreType): string {
    const { user, mode, limit, offset } = options ?? {};

    const base = this.API_ROOT;
    const query = new URLSearchParams();

    if (mode) query.append('mode', mode.toString());
    if (limit) query.append('limit', limit.toString());
    if (offset) query.append('offset', offset.toString());

    return `${base}/users/${user}/scores/${type}?${query}`;
  }

  generateBeatmapScoresURL(options: ILeaderboardRequestOptions): string {
    const { beatmapId, user, mode, mods } = options ?? {};

    const base = user ? this.API_ROOT : this.SERVER_ROOT;
    const query = new URLSearchParams();

    if (mode) query.append('mode', mode.toString());

    if (mods) {
      const acronyms = mods.match(/.{1,2}/g);

      acronyms?.forEach((acronym) => query.append('mods[]', acronym));
    }

    let url = `${base}/beatmaps/${beatmapId}/scores`;

    if (user) url += `/users/${user}/all`;

    return `${url}?${query}`;
  }

  generateUserInfoURL(options: IUserRequestOptions): string {
    const { user, mode } = options;

    return `${this.API_ROOT}/users/${user}/${mode ?? 'osu'}?key=in`;
  }

  generateDifficultyURL(options: IDifficultyRequestOptions): string {
    const { beatmapId } = options;

    return `${this.API_ROOT}/beatmaps/${beatmapId}/attributes`;
  }
}
