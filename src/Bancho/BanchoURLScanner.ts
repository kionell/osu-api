import { URLScanner } from '@Core';

export class BanchoURLScanner extends URLScanner {
  /**
   * Name of this server.
   */
  readonly SERVER_NAME = 'Bancho';

  readonly BASE_REGEX = new RegExp(''
    + /^(https?:\/\/)?/.source /* Protocol */
    + /(old|osu|dev|lazer).ppy.sh/.source, /* Domain */
  );

  readonly USER_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/(u|users)/.source /* Path */
    + /\/[A-z0-9]+/.source /* User ID or nickname*/
    + /(#(osu|taiko|fruits|mania)|\/(osu|taiko|fruits|mania)){0,1}$/.source, /* Additions */
  );

  readonly BEATMAP_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/(b|beatmaps)/.source /* Path */
    + /\/[0-9]+/.source /* Beatmap ID */
    + /((\?mode=(osu|taiko|fruits|mania))|(\?m=(0|1|2|3))){0,1}$/.source, /* Mode additions */
  );

  readonly BEATMAPSET_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/(s|beatmapsets)/.source /* Path */
    + /\/[0-9]+/.source /* Beatmapset ID */
    + /(#(osu|taiko|fruits|mania)){0,1}$/.source, /* Additions */
  );

  readonly BEATMAP_WITH_SET_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/(s|beatmapsets)/.source /* Path */
    + /\/[0-9]+/.source /* Beatmapset ID */
    + /(#(osu|taiko|fruits|mania)){0,1}/.source /* Additions */
    + /\/[0-9]+$/.source, /* Beatmap ID */
  );

  readonly SCORE_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/scores/.source /* Path */
    + /(\/(osu|taiko|fruits|mania))?/.source /* Mode additions */
    + /\/[0-9]+$/.source, /* Score ID */
  );

  /**
   * Searches for beatmapset URL in the text.
   * @param text Input text.
   * @returns Result of search.
   */
  hasBeatmapsetURL(text?: string | null): boolean {
    return !!text?.split(' ')?.find((arg) => this.isBeatmapsetURL(arg));
  }

  isBeatmapURL(url?: string | null): boolean {
    if (!url) return false;

    return this.BEATMAP_REGEX.test(url)
      || this.BEATMAP_WITH_SET_REGEX.test(url);
  }

  isBeatmapURLWithRuleset(url?: string | null): boolean {
    if (!url) return false;

    const isBeatmapURL = this.BEATMAP_REGEX.test(url)
      || this.BEATMAP_WITH_SET_REGEX.test(url);

    const params = new URL(url).searchParams;
    const mode = params.get('m') ?? params.get('mode');

    const hasRuleset = mode === '0' || url.includes('osu')
      || mode === '1' || url.includes('taiko')
      || mode === '2' || url.includes('fruits')
      || mode === '3' || url.includes('mania');

    return isBeatmapURL && hasRuleset;
  }

  /**
   * Checks if specified URL is beatmapset URL.
   * @param url Target URL.
   * @returns Result of cheking.
   */
  isBeatmapsetURL(url?: string | null): boolean {
    if (!url) return false;

    return this.BEATMAPSET_REGEX.test(url);
  }

  getBeatmapsetIdFromURL(url?: string | null): number {
    if (!url) return 0;

    if (this.RAW_ID_REGEX.test(url)) {
      return parseInt(url);
    }

    const regex = this.MULTIPLE_ID_REGEX;

    if (this.isBeatmapsetURL(url)) {
      const match = url.match(regex) as RegExpMatchArray;

      return parseInt(match[0]);
    }

    return 0;
  }
}
