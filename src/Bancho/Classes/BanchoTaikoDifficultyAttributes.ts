import { TaikoRuleset, TaikoDifficultyAttributes } from 'osu-taiko-stable';
import type { IBanchoTaikoDifficulty } from '../Interfaces';

export class BanchoTaikoDifficultyAttributes extends TaikoDifficultyAttributes {
  constructor(other: IBanchoTaikoDifficulty, mods?: string | number) {
    const ruleset = new TaikoRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);

    this.maxCombo = other.max_combo ?? 0;
    this.staminaStrain = other.stamina_difficulty ?? 0;
    this.rhythmStrain = other.rhythm_difficulty ?? 0;
    this.colourStrain = other.colour_difficulty ?? 0;
    this.approachRate = other.approach_rate ?? 0;
    this.greatHitWindow = other.great_hit_window ?? 0;
  }
}
