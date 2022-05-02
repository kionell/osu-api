import type { IBanchoDifficulty } from './IBanchoDifficulty';

export interface IBanchoTaikoDifficulty extends IBanchoDifficulty {
  stamina_difficulty: number;
  rhythm_difficulty: number;
  colour_difficulty: number;
  approach_rate: number;
  great_hit_window: number;
}
