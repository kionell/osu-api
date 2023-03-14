import { BeatmapInfo } from 'osu-classes';
import { GameMode } from '@Core';
import type { IBanchoBeatmapCompact, IBanchoBeatmap } from '../Interfaces';

export class BanchoBeatmapInfo extends BeatmapInfo {
  constructor(other: IBanchoBeatmapCompact | IBanchoBeatmap) {
    super();

    const full = other as IBanchoBeatmap;

    this.id = other.id;
    this.beatmapsetId = other.beatmapset_id;
    this.hashMD5 = other.checksum ?? this.hashMD5;
    this.creatorId = other?.user_id || other.beatmapset?.user_id || this.creatorId;
    this.creator = other.beatmapset?.creator ?? this.creator;

    this.title = other.beatmapset?.title ?? this.title;
    this.artist = other.beatmapset?.artist ?? this.artist;
    this.favourites = other.beatmapset?.favourite_count ?? this.favourites;
    this.passcount = full.passcount ?? this.passcount;
    this.playcount = full.playcount ?? this.playcount;
    this.status = full.ranked ?? this.status;
    this.version = other.version;

    this.hittable = full.count_circles ?? this.hittable;

    if (full.mode_int === GameMode.Mania) {
      this.holdable = full.count_sliders ?? this.holdable;
    }
    else {
      this.slidable = full.count_sliders ?? this.slidable;
      this.spinnable = full.count_spinners ?? this.spinnable;
    }

    this.length = other.total_length;
    this.bpm = full.bpm ?? this.bpm;
    this.bpmMin = this.bpmMax = this.bpm;

    this.circleSize = full.cs ?? this.circleSize;
    this.approachRate = full.ar ?? this.approachRate;
    this.overallDifficulty = full.accuracy ?? this.overallDifficulty;
    this.drainRate = full.drain ?? this.drainRate;

    this.starRating = other.difficulty_rating;
    this.maxCombo = other.max_combo ?? this.maxCombo;
    this.rulesetId = full.mode_int ?? this.rulesetId;
    this.isConvert = full.convert ?? this.isConvert;

    this.deletedAt = full.deleted_at
      ? new Date(full.deleted_at) : this.deletedAt;

    this.updatedAt = full.last_updated
      ? new Date(full.last_updated) : this.updatedAt;
  }
}
