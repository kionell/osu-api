import { GameMode } from '../Enums';

export interface IUserRequestOptions {
  user: string | number;
  mode?: GameMode;
}
