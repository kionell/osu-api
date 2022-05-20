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
class APIFactory {
  /**
   * Creates a new API client based on a server name.
   * @param server Server name.
   * @returns API client.
   */
  getAPIClient(server?: keyof typeof Server | null): APIClient | APIClientWithOAuth {
    if (server === null || server === undefined) {
      return BanchoAPIClient.getInstance();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari':
      case 'bancho': return BanchoAPIClient.getInstance();
    }

    throw new Error('This server is not found or not supported!');
  }

  /**
   * Creates a new instance of URL scanner based on a server name.
   * @param server Server name.
   * @returns URL scanner.
   */
  createURLScanner(server?: keyof typeof Server | null): URLScanner {
    if (server === null || server === undefined) {
      return new BanchoURLScanner();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari':
      case 'bancho': return new BanchoURLScanner();
    }

    throw new Error('This server is not found or not supported!');
  }

  /**
   * Creates a new instance of URL generator based on a server name.
   * @param server Server name.
   * @returns URL generator.
   */
  createURLGenerator(server?: keyof typeof Server | null): URLGenerator {
    if (server === null || server === undefined) {
      return new BanchoURLGenerator();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari':
      case 'bancho': return new BanchoURLGenerator();
    }

    throw new Error('This server is not found or not supported!');
  }
}

export default new APIFactory();
