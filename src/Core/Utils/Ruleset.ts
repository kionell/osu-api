import { StandardRuleset } from 'osu-standard-stable';
import { TaikoRuleset } from 'osu-taiko-stable';
import { CatchRuleset } from 'osu-catch-stable';
import { ManiaRuleset } from 'osu-mania-stable';
import type { IRuleset } from 'osu-classes';
import { GameMode } from '../Enums';

/**
 * Tries to convert input value to ruleset ID.
 * @param input Input value.
 * @returns Ruleset ID.
 */
export function getRulesetId(input?: string | number | null): GameMode {
  if (input === null || input === undefined) {
    return GameMode.Osu;
  }

  switch (typeof input === 'string' ? input.toLowerCase() : input) {
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
 * Tries to convert input value to ruleset shortname.
 * @param input Input value.
 * @returns Ruleset shortname.
 */
export function getRulesetShortname(input?: number | null): Lowercase<keyof typeof GameMode> {
  if (input === null || input === undefined) {
    return 'osu';
  }

  switch (input) {
    case GameMode.Osu: return 'osu';
    case GameMode.Taiko: return 'taiko';
    case GameMode.Fruits: return 'fruits';
    case GameMode.Mania: return 'mania';
  }

  throw new Error('Unknown ruleset!');
}

/**
 * Tries to create a new ruleset instance by input value.
 * @param input Input value.
 * @returns Ruleset instance.
 */
export function getRuleset(input?: string | number | null): IRuleset {
  const rulesetId = getRulesetId(input);

  switch (rulesetId) {
    case GameMode.Osu: return new StandardRuleset();
    case GameMode.Taiko: return new TaikoRuleset();
    case GameMode.Fruits: return new CatchRuleset();
    case GameMode.Mania: return new ManiaRuleset();
  }
}
