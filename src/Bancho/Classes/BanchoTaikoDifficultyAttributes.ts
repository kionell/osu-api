import { TaikoRuleset, TaikoDifficultyAttributes } from 'osu-taiko-stable';
import type { IBanchoTaikoDifficulty } from '../Interfaces';

export class BanchoTaikoDifficultyAttributes extends TaikoDifficultyAttributes {
  constructor(other: IBanchoTaikoDifficulty, mods?: string | number) {
    const ruleset = new TaikoRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);

    this.maxCombo = other.max_combo ?? 0;
    this.staminaDifficulty = other.stamina_difficulty ?? 0;
    this.rhythmDifficulty = other.rhythm_difficulty ?? 0;
    this.colourDifficulty = other.colour_difficulty ?? 0;
    this.peakDifficulty = other.peak_difficulty ?? 0;
    this.greatHitWindow = other.great_hit_window ?? 0;
  }
}
