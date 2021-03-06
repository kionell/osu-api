import { GameMode } from './Enums';

/**
 * Abstract URL generator.
 */
export abstract class URLGenerator {
  /**
   * Base link to the osu! website.
   */
  readonly SERVER_ROOT = 'https://osu.ppy.sh';

  /**
   * Base link to the osu! beatmap assets.
   */
  readonly ASSETS_ROOT = 'https://assets.ppy.sh';

  /**
   * Base link to the osu! avatars.
   */
  readonly AVATARS_ROOT = 'https://a.ppy.sh';

  /**
   * Generates a user profile URL by user ID or username.
   * @param user User ID or username.
   * @returns Generated user URL.
   */
  generateUserURL(user: string | number): string {
    return `${this.SERVER_ROOT}/u/${user}`;
  }

  /**
   * Generates a beatmap URL by beatmap ID.
   * @param beatmapId Beatmap ID.
   * @returns Generated beatmap URL.
   */
  generateBeatmapURL(beatmapId: string | number, rulesetId?: GameMode): string {
    const url = new URL(`${this.SERVER_ROOT}/b/${beatmapId}`);

    if (typeof rulesetId === 'number') {
      url.searchParams.append('m', rulesetId.toString());
    }

    return url.toString();
  }

  /**
   * Generates a user avatar URL by user ID.
   * @param userId User ID.
   * @returns Generated user avatar URL.
   */
  generateAvatarURL(userId: string | number): string {
    return `${this.AVATARS_ROOT}/${userId}`;
  }

  /**
   * Generates a beatmap cover URL by beatmapset ID.
   * @param beatmapsetId Beatmapset ID.
   * @returns Generated beatmap cover URL.
   */
  generateBeatmapCoverURL(beatmapsetId: string | number): string {
    return `${this.ASSETS_ROOT}/beatmaps/${beatmapsetId}/covers/cover.jpg`;
  }

  /**
   * Generates a beatmap thumbnail URL by beatmapset ID.
   * @param beatmapsetId Beatmapset ID.
   * @returns Generated beatmap thumbnail URL.
   */
  generateBeatmapThumbnailURL(beatmapsetId: string | number): string {
    return `${this.ASSETS_ROOT}/beatmaps/${beatmapsetId}/covers/list.jpg`;
  }
}
