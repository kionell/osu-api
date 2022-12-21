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
    return !!this.getServerURL(text);
  }

  /**
   * Searches for any server URL in the text.
   * @param text Input text.
   * @returns Found server URL.
   */
  getServerURL(text?: string | null): string | null {
    return text?.match(this.BASE_REGEX)?.[0] ?? null;
  }

  /**
   * Searches for user URL in the text.
   * @param text Input text.
   * @returns Result of search.
   */
  hasUserURL(text?: string | null): boolean {
    return !!this.getUserURL(text);
  }

  /**
   * Searches for user URL in the text.
   * @param text Input text.
   * @returns Found user URL.
   */
  getUserURL(text?: string | null): string | null {
    return text?.match(this.USER_REGEX)?.[0] ?? null;
  }

  /**
   * Searches for beatmap URL in the text.
   * @param text Input text.
   * @returns Result of search.
   */
  hasBeatmapURL(text?: string | null): boolean {
    return !!this.getBeatmapURL(text);
  }

  /**
   * Searches for beatmap URL in the text.
   * @param text Input text.
   * @returns Found beatmap URL.
   */
  getBeatmapURL(text?: string | null): string | null {
    return text?.match(this.BEATMAP_REGEX)?.[0] ?? null;
  }

  /**
   * Searches for score URL in the text.
   * @param text Input text.
   * @returns Result of search.
   */
  hasScoreURL(text?: string | null): boolean {
    return !!this.getScoreURL(text);
  }

  /**
   * Searches for score URL in the text.
   * @param text Input text.
   * @returns Found score URL.
   */
  getScoreURL(text?: string | null): string | null {
    return text?.match(this.SCORE_REGEX)?.[0] ?? null;
  }

  /**
   * Checks if specified URL is any server related URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isServerURL(text?: string | null): boolean {
    return text?.match(this.BASE_REGEX)?.index === 0;
  }

  /**
   * Checks if specified URL is user URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isUserURL(text?: string | null): boolean {
    return text?.match(this.USER_REGEX)?.index === 0;
  }

  /**
   * Checks if specified URL is beatmap URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isBeatmapURL(text?: string | null): boolean {
    return text?.match(this.BEATMAP_REGEX)?.index === 0;
  }

  /**
   * Checks if specified URL is beatmap URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isScoreURL(text?: string | null): boolean {
    return text?.match(this.SCORE_REGEX)?.index === 0;
  }

  getRulesetIdFromURL(url?: string | null): GameMode | null {
    if (!url || !this.isServerURL(url)) return null;

    const params = new URL(url).searchParams;
    const mode = params.get('m') ?? params.get('mode');

    if (mode === '3' || mode === 'mania') return GameMode.Mania;
    if (mode === '2' || mode === 'fruits') return GameMode.Fruits;
    if (mode === '1' || mode === 'taiko') return GameMode.Taiko;
    if (mode === '0' || mode === 'osu') return GameMode.Osu;

    if (this.isBeatmapURL(url)) {
      if (url.includes('#mania')) return GameMode.Mania;
      if (url.includes('#fruits')) return GameMode.Fruits;
      if (url.includes('#taiko')) return GameMode.Taiko;
      if (url.includes('#osu')) return GameMode.Osu;
    }

    if (this.isScoreURL(url)) {
      if (url.includes('mania')) return GameMode.Mania;
      if (url.includes('fruits')) return GameMode.Fruits;
      if (url.includes('taiko')) return GameMode.Taiko;
      if (url.includes('osu')) return GameMode.Osu;
    }

    return null;
  }

  getBeatmapIdFromURL(url?: string | null): number {
    if (!url) return 0;

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    if (this.isBeatmapURL(url)) {
      const parsedURL = new URL(url);
      const path = parsedURL.pathname + parsedURL.hash;
      const match = path.match(this.MULTIPLE_ID_REGEX) as RegExpMatchArray;

      return parseInt(match[match.length - 1]);
    }

    return 0;
  }

  getScoreIdFromURL(url?: string | null): number {
    if (!url) return 0;

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    if (this.isScoreURL(url)) {
      const match = url.match(this.MULTIPLE_ID_REGEX) as RegExpMatchArray;

      return parseInt(match[match.length - 1]);
    }

    return 0;
  }
}
