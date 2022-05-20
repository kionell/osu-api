import { StandardRuleset } from 'osu-standard-stable';
import { TaikoRuleset } from 'osu-taiko-stable';
import { CatchRuleset } from 'osu-catch-stable';
import { ManiaRuleset } from 'osu-mania-stable';
import type { IRuleset } from 'osu-classes';
import { GameMode } from '../Enums';

/**
 * Tries to convert input value to ruleset ID.
 * @param rulesetName Ruleset name.
 * @returns Ruleset ID.
 */
export function getRulesetId(input?: string | number): GameMode {
  const value = typeof input === 'string' ? input.toLowerCase() : input;

  switch (value) {
    case GameMode.Osu:
    case 'standard':
    case 'std':
    case 'osu': return GameMode.Osu;
    case GameMode.Taiko:
    case 'taiko': return GameMode.Taiko;
    case GameMode.Fruits:
    case 'ctb':
    case 'catch':
    case 'fruits': return GameMode.Fruits;
    case GameMode.Mania:
    case 'mania': return GameMode.Mania;
  }

  throw new Error('Unknown ruleset!');
}

/**
 * Tries to create a new ruleset instance by input value.
 * @param input .
 * @returns Ruleset instance.
 */
export function getRuleset(input?: string | number): IRuleset {
  const rulesetId = getRulesetId(input);

  switch (rulesetId) {
    case GameMode.Osu: return new StandardRuleset();
    case GameMode.Taiko: return new TaikoRuleset();
    case GameMode.Fruits: return new CatchRuleset();
    case GameMode.Mania: return new ManiaRuleset();
  }
}
