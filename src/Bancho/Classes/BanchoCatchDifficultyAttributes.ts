import { CatchRuleset, CatchDifficultyAttributes } from 'osu-catch-stable';
import type { IBanchoCatchDifficulty } from '../Interfaces';

export class BanchoCatchDifficultyAttributes extends CatchDifficultyAttributes {
  constructor(other: IBanchoCatchDifficulty, mods?: string | number) {
    const ruleset = new CatchRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);

    this.maxCombo = other?.max_combo ?? 0;
    this.approachRate = other?.approach_rate ?? 0;
  }
}
