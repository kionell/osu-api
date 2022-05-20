import { UserInfo } from 'osu-classes';
import { getRulesetId } from '@Core';
import type { IBanchoUserCompact, IBanchoUser } from '../Interfaces';

export class BanchoUserInfo extends UserInfo {
  constructor(other: IBanchoUserCompact | IBanchoUser) {
    super();

    const full = other as IBanchoUser;
    const rulesetId = getRulesetId(full.playmode);

    this.countryCode = other.country_code;
    this.id = other.id;
    this.isActive = other.is_active;
    this.isBot = other.is_bot;
    this.isDeleted = other.is_deleted;
    this.isOnline = other.is_online;
    this.isSupporter = other.is_supporter;
    this.username = other.username;
    this.playmode = rulesetId ?? this.playmode;

    this.lastVisitAt = other.last_visit
      ? new Date(other.last_visit) : null;
  }
}
