import { ScoreRank } from 'osu-classes';
import { GameMode } from '@Core';
import { CompletionStatus } from '../Enums/CompletionStatus';
import { IGatariBeatmapCompact } from './IGatariBeatmapCompact';

export interface IGatariUserScore {
  accuracy: number;
  beatmap: IGatariBeatmapCompact,
  completed: CompletionStatus;
  count_100: number;
  count_300: number;
  count_50: number;
  count_gekis: number;
  count_katu: number;
  count_miss: number;
  full_combo: boolean;
  id: number;
  isfav: boolean;
  max_combo: number;
  mods: number;
  play_mode: GameMode;
  pp: number;
  ranking: keyof typeof ScoreRank;
  score: number;
  time: number;
  views: number;
}
