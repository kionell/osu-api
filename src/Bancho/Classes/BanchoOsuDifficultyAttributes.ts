import { StandardRuleset, StandardDifficultyAttributes } from 'osu-standard-stable';
import type { IBanchoOsuDifficulty } from '../Interfaces';

export class BanchoOsuDifficultyAttributes extends StandardDifficultyAttributes {
  constructor(other: IBanchoOsuDifficulty, mods?: string | number) {
    const ruleset = new StandardRuleset();
    const combination = ruleset.createModCombination(mods);

    super(combination, other.star_rating);

    this.maxCombo = other.max_combo ?? 0;
    this.aimDifficulty = other.aim_difficulty ?? 0;
    this.speedDifficulty = other.speed_difficulty ?? 0;
    this.speedNoteCount = other.speed_note_count ?? 0;
    this.flashlightDifficulty = other.flashlight_difficulty ?? 0;
    this.sliderFactor = other.slider_factor ?? 0;
    this.approachRate = other.approach_rate ?? 0;
    this.overallDifficulty = other.overall_difficulty ?? 0;
  }
}
