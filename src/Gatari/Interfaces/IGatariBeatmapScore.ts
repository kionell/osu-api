import { CountryCode, ScoreRank } from 'osu-classes';
import { GameMode } from '@Core';

export interface IGatariBeatmapScore {
  friend: 0 | 1;
  id: number;
  userid: number;
  score: number;
  accuracy: number;
  rank: keyof typeof ScoreRank;
  max_combo: number;
  count_300: number;
  count_100: number;
  count_50: number;
  gekis_count: number;
  katus_count: number;
  count_miss: number;
  mods: number;
  pp: number;
  play_mode: GameMode;
  time: number;
  country: keyof typeof CountryCode,
  fc: number;
  username: string;
}
