import type { IBanchoDifficulty } from './IBanchoDifficulty';

export interface IBanchoOsuDifficulty extends IBanchoDifficulty {
  aim_difficulty: number;
  speed_difficulty: number;
  speed_note_count: number;
  flashlight_difficulty: number;
  slider_factor: number;
  approach_rate: number;
  overall_difficulty: number;
}
