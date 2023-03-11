import type { GameMode } from '@Core';
import type { IBanchoBeatmapCompact } from './IBanchoBeatmapCompact';
import type { BanchoRankStatus } from '../Enums';

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
  mode_int: GameMode;
  passcount: number;
  playcount: number;
  ranked: BanchoRankStatus;
  url: string;
}
