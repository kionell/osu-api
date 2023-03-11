import { GameMode } from '../Enums';

export interface ILeaderboardRequestOptions {
  beatmapId: string | number;
  mode?: GameMode;
  user?: string | number;
  mods?: string;
}
