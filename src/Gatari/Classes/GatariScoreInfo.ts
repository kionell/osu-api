import { ScoreInfo } from 'osu-classes';
import { getRuleset } from '@Core';
import { GatariBeatmapInfo } from './GatariBeatmapInfo';
import type {
  IGatariUserScore,
  IGatariBeatmapScore,
  IGatariUserBeatmapScore,
} from '../Interfaces';

export class GatariScoreInfo extends ScoreInfo {
  constructor(other: IGatariUserScore | IGatariBeatmapScore | IGatariUserBeatmapScore) {
    super();

    const full = other as IGatariUserScore & IGatariBeatmapScore & IGatariUserBeatmapScore;

    this.id = full?.id ?? this.id;
    this.totalScore = full?.score ?? this.totalScore;
    this.pp = full?.pp ?? this.pp;
    this.maxCombo = full?.max_combo ?? this.maxCombo;
    this.rank = full?.rank ?? full?.ranking ?? this.rank;
    this.passed = full?.rank !== 'F';
    this.perfect = full?.full_combo ?? full?.max_combo >= full?.fc;
    this.accuracy = full?.accuracy ?? this.accuracy;
    this.username = full?.username ?? this.username;
    this.userId = full?.userid ?? this.userId;

    this.rulesetId = full?.play_mode ?? this.rulesetId;
    this.ruleset = getRuleset(this.rulesetId);
    this.mods = this.ruleset.createModCombination(other.mods);

    if (full.beatmap) {
      this.beatmap = new GatariBeatmapInfo(full.beatmap);
    }

    this.beatmapId = full?.beatmap?.beatmap_id ?? this.beatmapId;
    this.date = full?.time ? new Date(full.time * 1000) : this.date;
    this.beatmapHashMD5 = full?.beatmap?.beatmap_md5 ?? this.beatmapHashMD5;

    this.countGeki = full?.count_gekis ?? full?.gekis_count ?? this.countGeki;
    this.countKatu = full?.count_katu ?? full?.katus_count ?? this.countKatu;
    this.count300 = full?.count_300 ?? this.count300;
    this.count100 = full?.count_100 ?? this.count100;
    this.count50 = full?.count_50 ?? this.count50;
    this.countMiss = full?.count_miss ?? this.countMiss;
  }
}
