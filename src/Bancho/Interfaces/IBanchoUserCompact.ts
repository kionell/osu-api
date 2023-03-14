import { CountryCode } from 'osu-classes';
import { IBanchoUserHighestRank } from './IBanchoUserHighestRank';
import { IBanchoUserRankHistory } from './IBanchoUserRankHistory';
import { IBanchoUserStatistics } from './IBanchoUserStatistics';

export interface IBanchoUserCompact {
  avatar_url: string;
  country_code: keyof typeof CountryCode;
  default_group: string;
  id: number;
  is_active: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_online: boolean;
  is_supporter: boolean;
  last_visit: string | null;
  pm_friends_only: boolean;
  profile_colour: string | null;
  username: string;
  previous_usernames?: string[];
  follower_count?: number;
  rank_highest?: IBanchoUserHighestRank;
  statistics?: IBanchoUserStatistics;
  rankHistory?: IBanchoUserRankHistory;
}
