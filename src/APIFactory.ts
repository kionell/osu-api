import type {
  APIClient,
  APIClientWithOAuth,
  URLGenerator,
  URLScanner,
  Server,
} from '@Core';

import * as Bancho from './Bancho';
import * as Gatari from './Gatari';

/**
 * An API factory.
 */
class APIFactory {
  getAPIClient(server?: keyof typeof Server | null): APIClient;
  getAPIClient(server: 'Bancho'): Bancho.BanchoAPIClient;
  getAPIClient(server: 'Gatari'): APIClient;
  getAPIClient(server: 'Akatsuki'): APIClient;
  getAPIClient(server: 'Ripple'): APIClient;

  /**
   * Creates a new API client based on a server name.
   * @param server Server name.
   * @returns API client.
   */
  getAPIClient(server?: keyof typeof Server | null): APIClient {
    if (server === null || server === undefined) {
      return Bancho.BanchoAPIClient.getInstance();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari':
      case 'bancho': return Bancho.BanchoAPIClient.getInstance();
    }

    throw new Error('This server is not found or not supported!');
  }

  addCredentials(server: 'Bancho', clientId: string, clientSecret: string): void;

  /**
   * Adds credentials to the specific server API.
   * @param server Server name.
   * @param clientId API client ID.
   * @param clientSecret API client secret.
   */
  addCredentials(server: keyof typeof Server, ...credentials: string[]): void {
    const client = this.getAPIClient(server) as APIClientWithOAuth;

    if (!client.addCredentials) {
      throw new Error('This server API does not require any authorization!');
    }

    switch (server?.toLowerCase()) {
      case 'bancho': client.addCredentials(credentials[0], credentials[1]);
    }
  }

  createURLScanner(server?: keyof typeof Server | null): URLScanner;
  createURLScanner(server: 'Bancho'): Bancho.BanchoURLScanner;
  createURLScanner(server: 'Gatari'): URLScanner;
  createURLScanner(server: 'Akatsuki'): URLScanner;
  createURLScanner(server: 'Ripple'): URLScanner;

  /**
   * Creates a new instance of URL scanner based on a server name.
   * @param server Server name.
   * @returns URL scanner.
   */
  createURLScanner(server?: keyof typeof Server | null): URLScanner {
    if (server === null || server === undefined) {
      return new Bancho.BanchoURLScanner();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari': return new Gatari.GatariURLScanner();
      case 'bancho': return new Bancho.BanchoURLScanner();
    }

    throw new Error('This server is not found or not supported!');
  }

  createURLGenerator(server?: keyof typeof Server | null): URLGenerator;
  createURLGenerator(server: 'Bancho'): Bancho.BanchoURLGenerator;
  createURLGenerator(server: 'Gatari'): URLGenerator;
  createURLGenerator(server: 'Akatsuki'): URLGenerator;
  createURLGenerator(server: 'Ripple'): URLGenerator;

  /**
   * Creates a new instance of URL generator based on a server name.
   * @param server Server name.
   * @returns URL generator.
   */
  createURLGenerator(server?: keyof typeof Server | null): URLGenerator {
    if (server === null || server === undefined) {
      return new Bancho.BanchoURLGenerator();
    }

    switch (server?.toLowerCase()) {
      case 'akatsuki':
      case 'ripple':
      case 'gatari': return new Gatari.GatariURLGenerator();
      case 'bancho': return new Bancho.BanchoURLGenerator();
    }

    throw new Error('This server is not found or not supported!');
  }
}

export default new APIFactory();
