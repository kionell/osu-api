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
   * @param user Beatmap ID.
   * @returns Generated beatmap URL.
   */
  generateBeatmapURL(beatmapId: string | number): string {
    return `${this.SERVER_ROOT}/b/${beatmapId}`;
  }

  /**
   * Generates a user avatar URL by user ID.
   * @param user User ID.
   * @returns Generated user avatar URL.
   */
  generateAvatarURL(userId: string | number): string {
    return `${this.AVATARS_ROOT}/${userId}`;
  }

  /**
   * Generates a beatmap cover URL by beatmapset ID.
   * @param user Beatmapset ID.
   * @returns Generated beatmap cover URL.
   */
  generateBeatmapCoverURL(beatmapsetId: string | number): string {
    return `${this.ASSETS_ROOT}/beatmaps/${beatmapsetId}/covers/cover.jpg`;
  }

  /**
   * Generates a beatmap thumbnail URL by beatmapset ID.
   * @param user Beatmapset ID.
   * @returns Generated beatmap thumbnail URL.
   */
  generateBeatmapThumbnailURL(beatmapsetId: string | number): string {
    return `${this.ASSETS_ROOT}/beatmaps/${beatmapsetId}/covers/list.jpg`;
  }
}
