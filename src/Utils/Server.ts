import { Server } from '@Core';
import { BanchoURLScanner } from '../Bancho';

/**
 * Tries to find server name by input value.
 * @param input Input value.
 * @returns Server name or null.
 */
export function getServerName(input?: string | null): keyof typeof Server | null {
  const banchoScanner = new BanchoURLScanner();

  if (banchoScanner.hasServerURL(input)) {
    return banchoScanner.SERVER_NAME;
  }

  return null;
}
