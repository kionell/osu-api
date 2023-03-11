import { URLScanner } from '@Core';

export class GatariURLScanner extends URLScanner {
  readonly BASE_REGEX = new RegExp(''
    + /(https?:\/\/)?/.source /* Protocol */
    + /osu\.gatari\.pw/.source, /* Domain */
  );

  readonly USER_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/u/.source /* Path */
    + /\/[A-z0-9]+/.source /* User ID or nickname*/
    + /((\/ap|\/rx)?(\?m=(0|1|2|3)))?/.source, /* Additions */
  );

  readonly BEATMAP_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/b/.source /* Path */
    + /\/[0-9]+/.source /* Beatmap ID */
    + /(\?m=(0|1|2|3))?/.source, /* Mode additions */
  );

  readonly BEATMAPSET_REGEX = new RegExp(''
    + this.BASE_REGEX.source /* Base */
    + /\/s/.source /* Path */
    + /\/[0-9]+/.source, /* Beatmapset ID */
  );
}
