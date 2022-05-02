import type { GameMode, RankStatus } from '@Core';
import type { IBanchoBeatmapset } from './IBanchoBeatmapset';
import type { IBanchoBeatmapsetCompact } from './IBanchoBeatmapsetCompact';

export interface IBanchoBeatmapCompact {
  beatmapset: IBanchoBeatmapset | IBanchoBeatmapsetCompact | null;
  beatmapset_id: number;
  difficulty_rating: number;
  id: number;
  mode: GameMode;
  status: Lowercase<keyof typeof RankStatus>;
  total_length: number;
  user_id: number;
  version: string;
  checksum?: string;
  max_combo?: number;
}
