import { Grades, LevelInfo, ScoreRank, UserInfo } from 'osu-classes';
import type { IGatariUserInfo, IGatariUserStats } from '../Interfaces';

export class GatariUserInfo extends UserInfo {
  constructor(info: IGatariUserInfo, stats: IGatariUserStats) {
    super();

    this.countryCode = info?.country ?? this.countryCode;
    this.id = info?.id ?? this.id;
    this.username = this._getDisplayName(info);

    // If user wasn't online for more than 3 months.
    this.isActive = Date.now() / 1000 - info.latest_activity < 8035200;
    this.isOnline = Boolean(info?.is_online ?? this.isOnline);
    this.lastVisitAt = new Date(info.latest_activity * 1000);
    this.playmode = info?.favourite_mode ?? this.playmode;
    this.followersCount = info?.followers_count ?? this.followersCount;

    if (info?.username_aka) {
      this.previousUsernames = [info.username_aka];
    }

    this.joinedAt = new Date(info.registered_on * 1000);

    this.grades = new Grades([
      [ScoreRank.A, stats?.a_count ?? 0],
      [ScoreRank.S, stats?.s_count ?? 0],
      [ScoreRank.SH, stats?.sh_count ?? 0],
      [ScoreRank.X, stats?.x_count ?? 0],
      [ScoreRank.XH, stats?.xh_count ?? 0],
    ]);

    this.globalRank = stats?.rank ?? this.globalRank;
    this.countryRank = stats?.country_rank ?? this.countryRank;

    this.level = new LevelInfo({
      current: stats?.level,
      progress: stats?.level_progress,
    });

    this.accuracy = stats?.avg_accuracy ?? this.accuracy;

    while (this.accuracy > 1) this.accuracy /= 100;

    this.maxCombo = stats?.max_combo ?? this.maxCombo;
    this.playcount = stats?.playcount ?? this.playcount;
    this.playtime = stats?.playtime ?? this.playtime;
    this.totalPerformance = stats?.pp ?? this.totalPerformance;
    this.rankedScore = stats?.ranked_score ?? this.rankedScore;
    this.replaysWatched = stats?.replays_watched ?? this.replaysWatched;
    this.totalHits = stats?.total_hits ?? this.totalHits;
    this.totalScore = stats?.total_score ?? this.totalScore;
  }

  /**
   * Concats osu!gatari clan name with username.
   * @param info osu!gatari user information.
   * @returns Formatted username.
   */
  private _getDisplayName(info: IGatariUserInfo): string {
    if (!info.username) return this.username;

    return info.abbr ? `[${info.abbr}] ${info.username}` : info.username;
  }
}
