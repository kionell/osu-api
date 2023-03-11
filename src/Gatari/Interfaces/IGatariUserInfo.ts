import { GameMode } from '@Core';

export interface IGatariUserInfo {
  abbr: string | null;
  clanid: number | null;
  country: Uppercase<string>;
  custom_hue: number;
  favourite_mode: GameMode;
  followers_count: number;
  id: number;
  is_online: 0 | 1;
  latest_activity: number;
  play_style: number;
  privileges: number;
  registered_on: number;
  username: string;
  username_aka: string;
}
