import { UserInfo } from 'osu-classes';
import type { IGatariUserInfo, IGatariUserStats } from '../Interfaces';

export class GatariUserInfo extends UserInfo {
  constructor(info: IGatariUserInfo, stats: IGatariUserStats) {
    super();

    this.countryCode = info?.country ?? this.countryCode;
    this.id = info?.id ?? this.id;

    // If user wasn't online for more than 3 months.
    this.isActive = Date.now() - info.latest_activity > 8035200000;
    this.isOnline = Boolean(info?.is_online ?? this.isOnline);
    this.lastVisitAt = new Date(info.latest_activity * 1000);
    this.username = info?.username ?? this.username;
    this.playmode = info?.favourite_mode ?? this.playmode;
    this.totalPerformance = stats?.pp ?? this.totalPerformance;
    this.globalRank = stats?.rank ?? this.globalRank;
    this.countryRank = stats?.country_rank ?? this.countryRank;
  }
}
