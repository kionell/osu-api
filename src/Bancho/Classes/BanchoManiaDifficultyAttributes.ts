import { ManiaRuleset, ManiaDifficultyAttributes } from 'osu-mania-stable';
import type { IBanchoManiaDifficulty } from '../Interfaces';

export class BanchoManiaDifficultyAttributes extends ManiaDifficultyAttributes {
  constructor(other: IBanchoManiaDifficulty, mods?: string | number) {
    const ruleset = new ManiaRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);

    this.maxCombo = other.max_combo ?? 0;
    this.greatHitWindow = other.great_hit_window ?? 0;
    this.scoreMultiplier = other.score_multiplier ?? 0;
  }
}
