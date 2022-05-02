import type { ScoreRank } from 'osu-classes';
import type { GameMode } from '@Core';
import type { IBanchoBeatmap } from './IBanchoBeatmap';
import type { IBanchoBeatmapCompact } from './IBanchoBeatmapCompact';
import type { IBanchoUserCompact } from './IBanchoUserCompact';
import type { IBanchoHitStatistics } from './IBanchoHitStatistics';

export interface IBanchoScore {
  id: number;
  best_id: number;
  user_id: number;
  accuracy: number;
  mods: string[];
  score: number;
  max_combo: number;
  perfect: boolean;
  statistics: IBanchoHitStatistics;
  passed: boolean;
  pp: number | null;
  rank: keyof typeof ScoreRank;
  created_at: string;
  mode: Lowercase<keyof typeof GameMode>;
  mode_int: GameMode;
  replay: boolean;
  beatmap?: IBanchoBeatmap | IBanchoBeatmapCompact;
  user?: IBanchoUserCompact;
}
