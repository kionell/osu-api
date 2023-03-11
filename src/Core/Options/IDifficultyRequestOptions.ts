import { GameMode } from '../Enums';

export interface IDifficultyRequestOptions {
  beatmapId: string | number;
  mode?: GameMode;
  mods?: string | number;
}
