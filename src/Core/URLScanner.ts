import { GameMode, Server } from './Enums';

/**
 * Abstract URL scanner.
 */
export abstract class URLScanner {
  /**
   * Name of this server.
   */
  abstract readonly SERVER_NAME: keyof typeof Server;

  /**
   * This regex is for matching signle number ID.
   */
  readonly RAW_ID_REGEX = /^[0-9]+$/;

  /**
   * This regex is for matching multiple number IDs.
   */
  readonly MULTIPLE_ID_REGEX = /[0-9]+/g;

  /**
   * Base regex for matching domain of the server.
   */
  abstract readonly BASE_REGEX: RegExp;

  /**
   * Regex for matching user endpoint of the server.
   */
  abstract readonly USER_REGEX: RegExp;

  /**
   * Regex for matching beatmap endpoint of the server.
   */
  abstract readonly BEATMAP_REGEX: RegExp;

  /**
   * Regex for matching beatmap endpoint of the server.
   */
  abstract readonly SCORE_REGEX: RegExp;

  /**
   * Searches for any server URL in the text.
   * @param text Input text.
   * @returns Result of search.
   */
  hasServerURL(text?: string | null): boolean {
    return !!text?.split(' ')?.find((arg) => this.isServerURL(arg));
  }

  /**
   * Searches for user URL in the text.
   * @param text Input text.
   * @returns Result of search.
   */
  hasUserURL(text?: string | null): boolean {
    return !!text?.split(' ')?.find((arg) => this.isUserURL(arg));
  }

  /**
   * Searches for beatmap URL in the text.
   * @param text Input text.
   * @returns Result of search.
   */
  hasBeatmapURL(text?: string | null): boolean {
    return !!text?.split(' ')?.find((arg) => this.isBeatmapURL(arg));
  }

  /**
   * Searches for score URL in the text.
   * @param text Input text.
   * @returns Result of search.
   */
  hasScoreURL(text?: string | null): boolean {
    return !!text?.split(' ')?.find((arg) => this.isScoreURL(arg));
  }

  /**
   * Checks if specified URL is any server related URL.
   * @param url Target URL.
   * @returns Result of cheking.
   */
  isServerURL(url?: string | null): boolean {
    if (!url) return false;

    return this.BASE_REGEX.test(url);
  }

  /**
   * Checks if specified URL is user URL.
   * @param url Target URL.
   * @returns Result of cheking.
   */
  isUserURL(url?: string | null): boolean {
    if (!url) return false;

    return this.USER_REGEX.test(url);
  }

  /**
   * Checks if specified URL is beatmap URL.
   * @param url Target URL.
   * @returns Result of cheking.
   */
  isBeatmapURL(url?: string | null): boolean {
    if (!url) return false;

    return this.BEATMAP_REGEX.test(url);
  }

  /**
   * Checks if specified URL is beatmap URL.
   * @param url Target URL.
   * @returns Result of cheking.
   */
  isScoreURL(url?: string | null): boolean {
    if (!url) return false;

    return this.SCORE_REGEX.test(url);
  }

  getRulesetIdFromURL(url?: string | null): GameMode | null {
    if (!url) return null;

    const params = new URL(url).searchParams;
    const mode = params.get('m') ?? params.get('mode');

    if (mode === '1' || url.includes('taiko')) return GameMode.Taiko;
    if (mode === '2' || url.includes('fruits')) return GameMode.Fruits;
    if (mode === '3' || url.includes('mania')) return GameMode.Mania;

    return GameMode.Osu;
  }

  getBeatmapIdFromURL(url?: string | null): number {
    if (!url) return 0;

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    const regex = this.MULTIPLE_ID_REGEX;

    if (this.isBeatmapURL(url)) {
      const match = url.match(regex) as RegExpMatchArray;

      return parseInt(match[match.length - 1]);
    }

    return 0;
  }

  getScoreIdFromURL(url?: string | null): number {
    if (!url) return 0;

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    const regex = this.MULTIPLE_ID_REGEX;

    if (this.isScoreURL(url)) {
      const match = url.match(regex) as RegExpMatchArray;

      return parseInt(match[match.length - 1]);
    }

    return 0;
  }
}
