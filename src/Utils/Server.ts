import { Server } from '@Core';
import { BanchoURLScanner } from '../Bancho';

/**
 * Tries to find server name by input value.
 * @param input Input value.
 * @returns Server name or null.
 */
export function getServerName(input?: string | null): keyof typeof Server | null {
  if (new BanchoURLScanner().hasServerURL(input)) return 'Bancho';

  return null;
}
