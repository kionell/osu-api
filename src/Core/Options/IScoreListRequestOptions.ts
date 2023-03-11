import { GameMode } from '../Enums';

export interface IScoreListRequestOptions {
  user: string | number;
  mode?: GameMode;
  mods?: string | number;
  limit?: number;
  offset?: number;
  includeFails?: boolean;
}
