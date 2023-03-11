import { GameMode, URLScanner } from '@Core';

export class BanchoURLScanner extends URLScanner {
  readonly BASE_REGEX = new RegExp(''
    + /(https?:\/\/)?/.source /* Protocol */
    + /(old|osu|dev|lazer)\.ppy\.sh/.source, /* Domain */
  );

  readonly USER_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/(u|users)/.source /* Path */
    + /\/[A-z0-9]+/.source /* User ID or nickname*/
    + /(#(osu|taiko|fruits|mania)|\/(osu|taiko|fruits|mania)){0,1}/.source, /* Additions */
  );

  readonly BEATMAP_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/(b|beatmaps)/.source /* Path */
    + /\/[0-9]+/.source /* Beatmap ID */
    + /((\?mode=(osu|taiko|fruits|mania))|(\?m=(0|1|2|3))){0,1}/.source, /* Mode additions */
  );

  readonly BEATMAPSET_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/(s|beatmapsets)/.source /* Path */
    + /\/[0-9]+/.source /* Beatmapset ID */
    + /(#(osu|taiko|fruits|mania)){0,1}/.source, /* Additions */
  );

  readonly BEATMAP_WITH_SET_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/(s|beatmapsets)/.source /* Path */
    + /\/[0-9]+/.source /* Beatmapset ID */
    + /(#(osu|taiko|fruits|mania)){0,1}/.source /* Additions */
    + /\/[0-9]+/.source, /* Beatmap ID */
  );

  readonly SCORE_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/scores/.source /* Path */
    + /(\/(osu|taiko|fruits|mania))?/.source /* Mode additions */
    + /\/[0-9]+/.source, /* Score ID */
  );

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

  isBeatmapURL(text?: string | null): boolean {
    return text?.match(this.BEATMAP_REGEX)?.index === 0
      || text?.match(this.BEATMAP_WITH_SET_REGEX)?.index === 0;
  }

  isBeatmapURLWithRuleset(text?: string | null): boolean {
    const isBeatmapURL = this.isBeatmapURL(text);

    if (!text || !isBeatmapURL) return false;

    const params = new URL(text).searchParams;
    const mode = params.get('m') ?? params.get('mode');

    const hasRuleset = mode === '0' || text.includes('osu')
      || mode === '1' || text.includes('taiko')
      || mode === '2' || text.includes('fruits')
      || mode === '3' || text.includes('mania');

    return isBeatmapURL && hasRuleset;
  }

  /**
   * Checks if specified URL is beatmap URL.
   * @param text Target URL.
   * @returns Result of cheking.
   */
  isScoreURL(text?: string | null): boolean {
    return text?.match(this.SCORE_REGEX)?.index === 0;
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

  getRulesetIdFromURL(url?: string | null): GameMode | null {
    if (!url || !this.isServerURL(url)) return null;

    const rulesetId = super.getRulesetIdFromURL(url);

    if (rulesetId !== null) return rulesetId;

    if (this.isScoreURL(url)) {
      if (url.includes('mania')) return GameMode.Mania;
      if (url.includes('fruits')) return GameMode.Fruits;
      if (url.includes('taiko')) return GameMode.Taiko;
      if (url.includes('osu')) return GameMode.Osu;
    }

    return null;
  }
}
