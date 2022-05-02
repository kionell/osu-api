import type { RankStatus } from '@Core';
import type { IBanchoBeatmapCompact } from './IBanchoBeatmapCompact';

export interface IBanchoBeatmap extends IBanchoBeatmapCompact {
  accuracy: number;
  ar: number;
  beatmapset_id: number;
  bpm: number | null;
  convert: boolean;
  count_circles: number;
  count_sliders: number;
  count_spinners: number;
  cs: number;
  deleted_at: string | null;
  drain: number;
  hit_length: number;
  is_scoreable: boolean;
  last_updated: string | null;
  mode_int: number;
  passcount: number;
  playcount: number;
  ranked: RankStatus;
  url: string;
}
