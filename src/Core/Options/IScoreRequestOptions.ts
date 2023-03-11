import { GameMode } from '../Enums';

export interface IScoreRequestOptions {
  scoreId: string | number;
  mode?: GameMode;
}
