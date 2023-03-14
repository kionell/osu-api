import { ScoreInfo } from 'osu-classes';
import { getRuleset } from '@Core';
import { BanchoBeatmapInfo } from './BanchoBeatmapInfo';
import type { IBanchoScore } from '../Interfaces';

export class BanchoScoreInfo extends ScoreInfo {
  constructor(other: IBanchoScore) {
    super();

    this.countGeki = other.statistics.count_geki;
    this.countKatu = other.statistics.count_katu;
    this.count300 = other.statistics.count_300;
    this.count100 = other.statistics.count_100;
    this.count50 = other.statistics.count_50;
    this.countMiss = other.statistics.count_miss;

    this.id = other.id;
    this.totalScore = other.score;
    this.totalPerformance = other.pp ?? this.totalPerformance;
    this.maxCombo = other.max_combo;
    this.passed = other.passed ?? other.rank !== 'F';
    this.perfect = other.perfect;
    this.userId = other.user_id;
    this.username = other.user?.username ?? this.username;

    this.rulesetId = other.mode_int ?? this.rulesetId;
    this.ruleset = getRuleset(this.rulesetId);
    this.mods = this.ruleset.createModCombination(other.mods.join(''));

    if (other.beatmap) {
      this.beatmap = new BanchoBeatmapInfo(other.beatmap);
    }

    this.beatmapId = other.beatmap?.id ?? this.beatmapId;
    this.date = new Date(other.created_at ?? Date.now());
  }
}
