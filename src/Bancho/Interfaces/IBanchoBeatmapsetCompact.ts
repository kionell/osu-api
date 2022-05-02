import type { IBanchoBeatmap } from './IBanchoBeatmap';

export interface IBanchoBeatmapsetCompact {
  artist: string;
  artist_unicode: string;
  beatmaps?: IBanchoBeatmap[];
  creator: string;
  favourite_count: number;
  id: number;
  nsfw: boolean;
  play_count: number;
  preview_url: string;
  source: string;
  status: string;
  title: string;
  title_unicode: string;
  user_id: number;
  video: boolean;
}
