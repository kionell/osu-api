import { IBanchoUserGrades } from './IBanchoUserGrades';
import { IBanchoUserLevel } from './IBanchoUserLevel';

export interface IBanchoUserStatistics {
  count_100: number;
  count_300: number;
  count_50: number;
  count_miss: number;
  grade_counts: IBanchoUserGrades;
  hit_accuracy: number;
  is_ranked: boolean;
  level: IBanchoUserLevel;
  maximum_combo: number;
  play_count: number;
  play_time: number;
  pp: number;
  global_rank: number | null;
  country_rank: number | null;
  ranked_score: number;
  replays_watched_by_others: number;
  total_hits: number;
  total_score: number;
}
