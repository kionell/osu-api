import { GameMode } from '@Core';
import { GatariRankStatus } from '../Enums';

export interface IGatariBeatmap {
  artist: string;
  version: string;
  max_combo: number;
  title: string;
  beatmapset_id: number;
  beatmap_id: number;
  ar: number;
  od: number;
  cs: number;
  hp: number;
  mode: GameMode;
  difficulty_std: number;
  difficulty_taiko: number;
  difficulty_ctb: number;
  difficulty_mania: number;
  hit_length: number;
  total_length: number;
  creator: string;
  bpm: number;
  ranked: GatariRankStatus;
  ranked_status_freezed: number;
  ranking_data: number;
  rating: number;
  playcount: number;
  passcount: number;
}
