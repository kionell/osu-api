import { GameMode } from '@Core';
import { CountryCode } from 'osu-classes';

export interface IGatariUserInfo {
  abbr: string | null;
  clanid: number | null;
  country: keyof typeof CountryCode;
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
