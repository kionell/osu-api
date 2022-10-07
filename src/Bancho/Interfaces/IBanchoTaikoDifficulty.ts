import type { IBanchoDifficulty } from './IBanchoDifficulty';

export interface IBanchoTaikoDifficulty extends IBanchoDifficulty {
  stamina_difficulty: number;
  rhythm_difficulty: number;
  colour_difficulty: number;
  peak_difficulty: number;
  great_hit_window: number;
}
