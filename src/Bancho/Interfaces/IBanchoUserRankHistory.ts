import { GameMode } from '@Core';

export interface IBanchoUserRankHistory {
  mode: Lowercase<keyof typeof GameMode>;
  data: number[];
}
