import {
  type APIClient,
  type APIClientWithOAuth,
  type URLGenerator,
  type URLScanner,
  Server,
} from '@Core';

import {
  BanchoAPIClient,
  BanchoURLGenerator,
  BanchoURLScanner,
} from './Bancho';

/**
 * An API factory.
 */
export class APIFactory {
  /**
   * Creates a new API client based on a server name.
   * @param server Server name.
   * @returns API client.
   */
  getAPIClient(server: number = Server.Bancho): APIClient | APIClientWithOAuth {
    switch (server) {
      case Server.Akatsuki:
      case Server.Ripple:
      case Server.Gatari:
      case Server.Bancho: return BanchoAPIClient.getInstance();
    }

    throw new Error('This server is not found or not supported!');
  }

  /**
   * Creates a new instance of URL scanner based on a server name.
   * @param server Server name.
   * @returns URL scanner.
   */
  createURLScanner(server: number = Server.Bancho): URLScanner {
    switch (server) {
      case Server.Akatsuki:
      case Server.Ripple:
      case Server.Gatari:
      case Server.Bancho: return new BanchoURLScanner();
    }

    throw new Error('This server is not found or not supported!');
  }

  /**
   * Creates a new instance of URL generator based on a server name.
   * @param server Server name.
   * @returns URL generator.
   */
  createURLGenerator(server: number = Server.Bancho): URLGenerator {
    switch (server) {
      case Server.Akatsuki:
      case Server.Ripple:
      case Server.Gatari:
      case Server.Bancho: return new BanchoURLGenerator();
    }

    throw new Error('This server is not found or not supported!');
  }
}
