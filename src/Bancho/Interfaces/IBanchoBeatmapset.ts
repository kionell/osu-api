import type { RankStatus } from '@Core';
import type { IBanchoBeatmapsetCompact } from './IBanchoBeatmapsetCompact';

export interface IBanchoBeatmapset extends IBanchoBeatmapsetCompact {
  bpm: number;
  creator: string;
  last_updated: string;
  ranked: RankStatus;
  ranked_date: string | null;
  source: string;
  storyboard: boolean;
  submitted_date: string | null;
  tags: string;
}
