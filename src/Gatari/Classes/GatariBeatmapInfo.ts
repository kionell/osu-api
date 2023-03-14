import { BeatmapInfo } from 'osu-classes';
import { GameMode } from '@Core';
import type { IGatariBeatmapCompact, IGatariBeatmap } from '../Interfaces';

export class GatariBeatmapInfo extends BeatmapInfo {
  constructor(other: IGatariBeatmapCompact | IGatariBeatmap) {
    super();

    const full = other as IGatariBeatmapCompact & IGatariBeatmap;

    this.id = full.beatmap_id;
    this.beatmapsetId = full.beatmapset_id;
    this.hashMD5 = full?.beatmap_md5 ?? this.hashMD5;
    this.creator = full?.creator ?? this.creator;

    this.title = full?.title ?? this.title;
    this.artist = full?.artist ?? this.artist;
    this.passcount = full?.passcount ?? this.passcount;
    this.playcount = full?.playcount ?? this.playcount;
    this.status = full?.ranked ?? this.status;
    this.version = full.version;

    this.length = full.hit_length;
    this.bpm = full?.bpm ?? this.bpm;
    this.bpmMin = this.bpmMax = this.bpm;

    this.circleSize = full.cs ?? this.circleSize;
    this.approachRate = full.ar ?? this.approachRate;
    this.overallDifficulty = full.od ?? this.overallDifficulty;
    this.drainRate = full.hp ?? this.drainRate;

    this.rulesetId = full.mode ?? this.rulesetId;
    this.starRating = this._getDifficulty(full);
    this.maxCombo = full.fc ?? this.maxCombo;
  }

  private _getDifficulty(other: IGatariBeatmapCompact & IGatariBeatmap): number {
    if (typeof other.difficulty === 'number') {
      return other.difficulty;
    }

    switch (other.mode) {
      case GameMode.Osu: return other.difficulty_std;
      case GameMode.Taiko: return other.difficulty_taiko;
      case GameMode.Fruits: return other.difficulty_ctb;
      case GameMode.Mania: return other.difficulty_mania;
    }
  }
}
