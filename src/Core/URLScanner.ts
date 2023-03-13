import { GameMode } from './Enums';

/**
 * Abstract URL scanner.
 */
export abstract class URLScanner {
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
   * Regex for matching beatmapset endpoint of the server.
   */
  abstract readonly BEATMAPSET_REGEX: RegExp;

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
   * Searches for beatmapset URL in the text.
   * @param text Input text.
   * @returns If input text has beatmapset URL.
   */
  hasBeatmapsetURL(text?: string | null): boolean {
    return !!this.getBeatmapsetURL(text);
  }

  /**
   * Searches for beatmapset URL in the text.
   * @param text Input text.
   * @returns Found beatmapset URL.
   */
  getBeatmapsetURL(text?: string | null): string | null {
    return text?.match(this.BEATMAPSET_REGEX)?.[0] ?? null;
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
   * Checks if specified URL is a server related URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isServerURL(text?: string | null): boolean {
    return text?.match(this.BASE_REGEX)?.index === 0;
  }

  /**
   * Checks if specified URL is a beatmap URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isBeatmapURL(text?: string | null): boolean {
    return text?.match(this.BEATMAP_REGEX)?.index === 0;
  }

  isBeatmapURLWithRuleset(text?: string | null): boolean {
    const isBeatmapURL = this.isBeatmapURL(text);

    if (!text || !isBeatmapURL) return false;

    const params = new URL(text).searchParams;
    const m = params.get('m');

    const hasRuleset = m === '0' || m === '1' || m === '2' || m === '3';

    return isBeatmapURL && hasRuleset;
  }

  /**
   * Checks if specified URL is beatmapset URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isBeatmapsetURL(text?: string | null): boolean {
    return text?.match(this.BEATMAPSET_REGEX)?.index === 0;
  }

  /**
   * Checks if specified URL is a user URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isUserURL(text?: string | null): boolean {
    return text?.match(this.USER_REGEX)?.index === 0;
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

  getBeatmapsetIdFromURL(url?: string | null): number {
    if (!url) return 0;

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    if (this.isBeatmapsetURL(url)) {
      const match = url.match(this.MULTIPLE_ID_REGEX) as RegExpMatchArray;

      return parseInt(match[0]);
    }

    return 0;
  }

  getRulesetIdFromURL(url?: string | null): GameMode | null {
    if (!url || !this.isServerURL(url)) return null;

    const params = new URL(url).searchParams;
    const mode = params.get('m') ?? params.get('mode');

    // Some servers use query params for converted beatmaps.
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

    return null;
  }
}
