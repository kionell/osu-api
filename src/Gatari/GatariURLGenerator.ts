import {
  URLGenerator,
  ScoreType,
  type IScoreListRequestOptions,
  type ILeaderboardRequestOptions,
  type IUserRequestOptions,
} from '@Core';

export class GatariURLGenerator extends URLGenerator {
  /**
   * Base link to the osu!gatari website.
   */
  readonly SERVER_ROOT = 'https://osu.gatari.pw';

  /**
   * Base link to the osu!gatari avatars.
   */
  readonly AVATARS_ROOT = 'https://a.gatari.pw';

  /**
   * Base link to the osu!gatari API.
   */
  readonly API_ROOT = 'https://api.gatari.pw';

  generateBeatmapInfoURL(beatmapId?: number | string): string {
    const base = this.API_ROOT;
    const query = new URLSearchParams();

    query.append('bb', beatmapId?.toString() || '0');

    return `${base}/beatmaps/get?${query}`;
  }

  generateUserInfoURL(options: IUserRequestOptions): string {
    return `${this.API_ROOT}/users/get?u=${options.user ?? 0}`;
  }

  generateUserStatsURL(options: IUserRequestOptions): string {
    const query = new URLSearchParams({
      u: options.user.toString(),
    });

    if (options.mode) {
      query.append('mode', options.mode.toString());
    }

    return `${this.API_ROOT}/user/stats?${query}`;
  }

  generateUserBestURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Best);
  }

  generateUserFirstsURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Firsts);
  }

  generateUserRecentURL(options: IScoreListRequestOptions): string {
    return this._generateUserScoresURL(options, ScoreType.Recent);
  }

  private _generateUserScoresURL(options: IScoreListRequestOptions, type: ScoreType): string {
    const { mode, limit, offset, includeFails } = options ?? {};

    const getDisplayScoreType = () => {
      switch (type) {
        case ScoreType.Best: return 'best';
        case ScoreType.Firsts: return 'first'; // Differs from the Bancho.
        case ScoreType.Recent: return 'recent';
      }
    };

    const query = new URLSearchParams({
      id: options.user as string,
    });

    if (mode) query.append('mode', mode.toString());
    if (offset) query.append('p', offset.toString());
    if (limit) query.append('l', limit.toString());
    if (includeFails) query.append('f', '1');

    const scoreType = getDisplayScoreType();

    return `${this.API_ROOT}/user/scores/${scoreType}?${query}`;
  }

  generateBeatmapScoresURL(options: ILeaderboardRequestOptions): string {
    const { beatmapId, user, mode } = options ?? {};

    const query = new URLSearchParams();

    if (mode) query.append('mode', mode.toString());

    if (user) {
      query.append('b', beatmapId.toString());
      query.append('u', user.toString());

      return `${this.API_ROOT}/beatmap/user/score?${query}`;
    }

    return `${this.API_ROOT}/beatmap/${beatmapId}/scores?${query}`;
  }
}
