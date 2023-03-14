import {
  RankHistory,
  HighestRank,
  UserInfo,
  Grades,
  ScoreRank,
  LevelInfo,
} from 'osu-classes';

import {
  IBanchoUserCompact,
  IBanchoUser,
} from '../Interfaces';

import { getRulesetId } from '@Core';

export class BanchoUserInfo extends UserInfo {
  constructor(other: IBanchoUserCompact | IBanchoUser) {
    super();

    const full = other as IBanchoUser;
    const rulesetId = getRulesetId(full.playmode);

    this.countryCode = other.country_code;
    this.id = other.id;
    this.isActive = other.is_active;
    this.isBot = other.is_bot;
    this.isDeleted = other.is_deleted;
    this.isOnline = other.is_online;
    this.isSupporter = other.is_supporter;
    this.username = other.username;
    this.playmode = rulesetId ?? this.playmode;
    this.followersCount = other.follower_count ?? this.followersCount;
    this.joinedAt = new Date(full.join_date);
    this.lastVisitAt = other.last_visit ? new Date(other.last_visit) : null;

    if (full.previous_usernames) {
      this.previousUsernames = [...full.previous_usernames];
    }

    if (full.rank_highest) {
      this.highestRank = new HighestRank({
        rank: full.rank_highest.rank,
        updatedAt: new Date(full.rank_highest.updated_at),
      });
    }

    if (full.statistics) {
      this.grades = new Grades([
        [ScoreRank.A, full.statistics.grade_counts.a],
        [ScoreRank.S, full.statistics.grade_counts.a],
        [ScoreRank.SH, full.statistics.grade_counts.sh],
        [ScoreRank.X, full.statistics.grade_counts.ss],
        [ScoreRank.XH, full.statistics.grade_counts.ssh],
      ]);

      this.accuracy = full.statistics.hit_accuracy;

      while (this.accuracy > 1) this.accuracy /= 100;

      this.level = new LevelInfo(full.statistics.level);
      this.maxCombo = full.statistics.maximum_combo;
      this.playcount = full.statistics.play_count;
      this.playtime = full.statistics.play_time;
      this.totalPerformance = full.statistics.pp;
      this.globalRank = full.statistics.global_rank;
      this.countryRank = full.statistics.country_rank;
      this.rankedScore = full.statistics.ranked_score;
      this.replaysWatched = full.statistics.replays_watched_by_others;
      this.totalHits = full.statistics.total_hits;
      this.totalScore = full.statistics.total_score;
    }

    if (full.rankHistory) {
      this.rankHistory = new RankHistory(full.rankHistory);
    }
  }
}
