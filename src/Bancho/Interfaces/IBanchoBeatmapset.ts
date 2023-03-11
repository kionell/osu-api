import type { BanchoRankStatus } from '../Enums';
import type { IBanchoBeatmapsetCompact } from './IBanchoBeatmapsetCompact';

export interface IBanchoBeatmapset extends IBanchoBeatmapsetCompact {
  bpm: number;
  creator: string;
  last_updated: string;
  ranked: BanchoRankStatus;
  ranked_date: string | null;
  source: string;
  storyboard: boolean;
  submitted_date: string | null;
  tags: string;
}
