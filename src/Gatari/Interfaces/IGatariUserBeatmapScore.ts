import { ScoreRank } from 'osu-classes';
import { GameMode } from '@Core';

export interface IGatariUserBeatmapScore {
  accuracy: number;
  count_100: number;
  count_300: number;
  count_50: number;
  count_miss: number;
  id: number;
  max_combo: number;
  mods: number;
  play_mode: GameMode;
  pp: number;
  rank: keyof typeof ScoreRank;
  score: number;
  time: number;
  top: number;
}
