import type { GameMode } from '@Core';
import type { IBanchoUserCompact } from './IBanchoUserCompact';

export interface IBanchoUser extends IBanchoUserCompact {
  playmode: Lowercase<keyof typeof GameMode>
}
