import { DifficultyAttributes, IScoreInfo, IBeatmapInfo, IUserInfo, IRuleset, ScoreRank, BeatmapInfo, ScoreInfo, UserInfo } from 'osu-classes';
import { Method, AxiosRequestConfig } from 'axios';
import { CatchDifficultyAttributes } from 'osu-catch-stable';
import { ManiaDifficultyAttributes } from 'osu-mania-stable';
import { StandardDifficultyAttributes } from 'osu-standard-stable';
import { TaikoDifficultyAttributes } from 'osu-taiko-stable';

/**
 * A response from an API.
 */
interface IAPIResponse {
  /**
     * Original URL of the request.
     */
  url: string;
  /**
     * Status code of this response.
     */
  status: number;
  /**
     * Error message of this reponse.
     */
  error: string | null;
  /**
     * Data of this response.
     */
  data: any;
}

/**
 * Cached API response.
 */
interface ICachedResponse extends IAPIResponse {
  /**
     * The time in milliseconds after which this response expires.
     */
  expiresIn?: number;
}

/**
 * An API cache.
 */
declare class APICache extends Map<string, ICachedResponse> {
  /**
     * Adds a new element to the cache. Removes it after a certain time if needed.
     * @param key The key that will be used to identify this response.
     * @param value The response value.
     * @returns Reference to this cache.
     */
  set(key: string, value: ICachedResponse): this;
}

/**
 * An API client.
 */
declare abstract class APIClient {
  /**
     * An API cache.
     */
  cache: APICache;
  /**
     * Singleton instances of different clients.
     */
  private static _instances;
  constructor();
  /**
     * Performs a request to the endpoint of API.
     * The response can be taken from the cache or obtained directly from the API.
     * @param url Request URL.
     * @param method Request method.
     * @param data Request data.
     * @returns API response or cached response.
     */
  protected _request(url: string, method?: Method, data?: unknown): Promise<IAPIResponse>;
  /**
     * Default API request config.
     */
  get config(): AxiosRequestConfig;
}

declare abstract class AuthTokens {
  /**
     * OAuth access token.
     */
  accessToken: string;
  /**
     * OAuth refresh token.
     */
  refreshToken: string;
  /**
     * OAuth token type.
     */
  type: string;
  /**
     * The date when this token expires.
     */
  expiresAt: Date;
  /**
     * The time after which this token will expire.
     */
  get expiresIn(): number;
  /**
     * Whether this token expired or not.
     */
  get isExpired(): boolean;
  /**
     * Whether this token valid or not.
     */
  get isValid(): boolean;
}

declare abstract class APIClientWithOAuth extends APIClient {
  /**
     * OAuth2 client ID.
     */
  protected _clientId: string | null;
  /**
     * OAuth2 client secret.
     */
  protected _clientSecret: string | null;
  /**
     * OAuth2 tokens.
     */
  protected _tokens: AuthTokens | null;
  /**
     * Authorize to the API.
     */
  abstract authorize(): Promise<boolean>;
  /**
     * Adds credentials to this API client.
     * @param clientId API client ID.
     * @param clientSecret API client secret.
     */
  addCredentials(clientId?: string, clientSecret?: string): void;
  /**
      * If this client is authorized or not.
      */
  get isAuthorized(): boolean;
  /**
     * Performs a request to the endpoint of API with pre-authorization.
     * The response can be taken from the cache or obtained directly from the API.
     * @param url Request URL.
     * @param method Request method.
     * @param data Request data.
     * @returns API response or cached response.
     */
  protected _request(url: string, method?: Method, data?: unknown): Promise<IAPIResponse>;
  /**
     * Default API request config with authorization.
     */
  get config(): AxiosRequestConfig;
}

declare const enum GameMode {
  Osu = 0,
  Taiko = 1,
  Fruits = 2,
  Mania = 3
}

declare const enum RankStatus {
  Graveyard = -2,
  WIP = -1,
  Pending = 0,
  Ranked = 1,
  Approved = 2,
  Qualified = 3,
  Loved = 4
}

declare const enum ScoreType {
  Best = 0,
  Firsts = 1,
  Recent = 2
}

declare const enum Server {
  Bancho = 0,
  Gatari = 1,
  Akatsuki = 2,
  Ripple = 3
}

declare const enum SortingType {
  Difficulty = 0,
  DifficultyReverse = 1,
  Performance = 2,
  PerformanceReverse = 3,
  Date = 4,
  DateReverse = 5,
  Accuracy = 6,
  AccuracyReverse = 7
}

interface IBeatmapRequestOptions {
  beatmapId?: string | number;
  mode?: number;
  mods?: string | number;
  search?: string;
  hash?: string;
}

interface ILeaderboardRequestOptions {
  beatmapId: string | number;
  mode?: number;
  user?: string | number;
  mods?: string;
  limit?: number;
}

interface IDifficultyRequestOptions {
  beatmapId: string | number;
  mode?: number;
  mods?: string | number;
}

interface IScoreListRequestOptions {
  user: string | number;
  mode?: number;
  mods?: string | number;
  limit?: number;
  offset?: number;
  includeFails?: boolean;
}

interface IScoreRequestOptions {
  scoreId: string | number;
  mode?: number;
}

interface IUserRequestOptions {
  user: string | number;
  mode?: number;
}

/**
 * API that gives access to the difficulty attributes.
 */
interface IHasAttributes {
  /**
     * Performs a request to the API to get difficulty attributes.
     * @param options Difficulty request options.
     * @returns Difficulty attributes or null.
     */
  getDifficulty(options?: IDifficultyRequestOptions): Promise<DifficultyAttributes | null>;
}

/**
 * API that gives access to the beatmap scores.
 */
interface IHasLeaderboard {
  /**
     * Performs a request to the API to get scores on a beatmap.
     * If user was specified then returns all user's scores on the beatmap.
     * Otherwise will return beatmap leaderboard scores.
     * @param options Beatmap score request options.
     * @returns The list of scores on the beatmap.
     */
  getLeaderboard(options?: ILeaderboardRequestOptions): Promise<IScoreInfo[]>;
}

/**
 * API that gives access to the beatmap information.
 */
interface IHasBeatmaps {
  /**
     * Performs a request to the API to get a beatmap information.
     * @param options Beatmap request options.
     * @returns Beatmap information or null.
     */
  getBeatmap(options?: IBeatmapRequestOptions): Promise<IBeatmapInfo | null>;
}

/**
 * API that gives access to the recent scores of a user.
 */
interface IHasRecent {
  /**
     * Performs a request to the API to get user recent scores.
     * @param options Score request options.
     * @returns The list of user's recent scores.
     */
  getUserRecent(options?: IScoreListRequestOptions): Promise<IScoreInfo[]>;
}

/**
 * API that gives access to the scores.
 */
interface IHasScores {
  /**
     * Performs a request to the API to get a score information.
     * @param options Score request options.
     * @returns Score information or null.
     */
  getScore(options?: IScoreRequestOptions): Promise<IScoreInfo | null>;
}

/**
 * API that gives access to the best scores of a user.
 */
interface IHasTop {
  /**
     * Performs a request to the API to get user's best scores.
     * @param options Score request options.
     * @returns The list of user's best scores.
     */
  getUserBest(options?: IScoreListRequestOptions): Promise<IScoreInfo[]>;
}

/**
 * API that gives access to the user information.
 */
interface IHasUsers {
  /**
     * Performs a request to the API to get user info.
     * @param options User request options.
     * @returns User information or null.
     */
  getUser(options?: IUserRequestOptions): Promise<IUserInfo | null>;
}

/**
 * Abstract URL generator.
 */
declare abstract class URLGenerator {
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
  generateUserURL(user: string | number): string;
  /**
     * Generates a beatmap URL by beatmap ID.
     * @param user Beatmap ID.
     * @returns Generated beatmap URL.
     */
  generateBeatmapURL(beatmapId: string | number): string;
  /**
     * Generates a user avatar URL by user ID.
     * @param user User ID.
     * @returns Generated user avatar URL.
     */
  generateAvatarURL(userId: string | number): string;
  /**
     * Generates a beatmap cover URL by beatmapset ID.
     * @param user Beatmapset ID.
     * @returns Generated beatmap cover URL.
     */
  generateBeatmapCoverURL(beatmapsetId: string | number): string;
  /**
     * Generates a beatmap thumbnail URL by beatmapset ID.
     * @param user Beatmapset ID.
     * @returns Generated beatmap thumbnail URL.
     */
  generateBeatmapThumbnailURL(beatmapsetId: string | number): string;
}

/**
 * Abstract URL scanner.
 */
declare abstract class URLScanner {
  /**
     * Name of this server.
     */
  abstract readonly SERVER_NAME: keyof typeof Server;
  /**
     * This regex is for matching signle number ID.
     */
  readonly RAW_ID_REGEX: RegExp;
  /**
     * This regex is for matching multiple number IDs.
     */
  readonly MULTIPLE_ID_REGEX: RegExp;
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
  hasServerURL(text?: string | null): boolean;
  /**
     * Searches for user URL in the text.
     * @param text Input text.
     * @returns Result of search.
     */
  hasUserURL(text?: string | null): boolean;
  /**
     * Searches for beatmap URL in the text.
     * @param text Input text.
     * @returns Result of search.
     */
  hasBeatmapURL(text?: string | null): boolean;
  /**
     * Searches for score URL in the text.
     * @param text Input text.
     * @returns Result of search.
     */
  hasScoreURL(text?: string | null): boolean;
  /**
     * Checks if specified URL is any server related URL.
     * @param url Target URL.
     * @returns Result of cheking.
     */
  isServerURL(url?: string | null): boolean;
  /**
     * Checks if specified URL is user URL.
     * @param url Target URL.
     * @returns Result of cheking.
     */
  isUserURL(url?: string | null): boolean;
  /**
     * Checks if specified URL is beatmap URL.
     * @param url Target URL.
     * @returns Result of cheking.
     */
  isBeatmapURL(url?: string | null): boolean;
  /**
     * Checks if specified URL is beatmap URL.
     * @param url Target URL.
     * @returns Result of cheking.
     */
  isScoreURL(url?: string | null): boolean;
  getBeatmapIdFromURL(url?: string | null): number;
  getScoreIdFromURL(url?: string | null): number;
}

declare function sortUserBest(scores: IScoreInfo[], order?: SortingType): IScoreInfo[];

/**
 * Tries to convert input value to ruleset ID.
 * @param input Input value.
 * @returns Ruleset ID.
 */
declare function getRulesetId(input?: string | number | null): GameMode;
/**
 * Tries to create a new ruleset instance by input value.
 * @param input Input value.
 * @returns Ruleset instance.
 */
declare function getRuleset(input?: string | number | null): IRuleset;

interface IBanchoAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface IBanchoBeatmapsetCompact {
  artist: string;
  artist_unicode: string;
  beatmaps?: IBanchoBeatmap[];
  creator: string;
  favourite_count: number;
  id: number;
  nsfw: boolean;
  play_count: number;
  preview_url: string;
  source: string;
  status: string;
  title: string;
  title_unicode: string;
  user_id: number;
  video: boolean;
}

interface IBanchoBeatmapset extends IBanchoBeatmapsetCompact {
  bpm: number;
  creator: string;
  last_updated: string;
  ranked: RankStatus;
  ranked_date: string | null;
  source: string;
  storyboard: boolean;
  submitted_date: string | null;
  tags: string;
}

interface IBanchoBeatmapCompact {
  beatmapset: IBanchoBeatmapset | IBanchoBeatmapsetCompact | null;
  beatmapset_id: number;
  difficulty_rating: number;
  id: number;
  mode: GameMode;
  status: Lowercase<keyof typeof RankStatus>;
  total_length: number;
  user_id: number;
  version: string;
  checksum?: string;
  max_combo?: number;
}

interface IBanchoBeatmap extends IBanchoBeatmapCompact {
  accuracy: number;
  ar: number;
  beatmapset_id: number;
  bpm: number | null;
  convert: boolean;
  count_circles: number;
  count_sliders: number;
  count_spinners: number;
  cs: number;
  deleted_at: string | null;
  drain: number;
  hit_length: number;
  is_scoreable: boolean;
  last_updated: string | null;
  mode_int: number;
  passcount: number;
  playcount: number;
  ranked: RankStatus;
  url: string;
}

interface IBanchoDifficulty {
  max_combo: number;
  star_rating: number;
}

interface IBanchoCatchDifficulty extends IBanchoDifficulty {
  approach_rate: number;
}

interface IBanchoHitStatistics {
  count_50: number;
  count_100: number;
  count_300: number;
  count_geki: number;
  count_katu: number;
  count_miss: number;
}

interface IBanchoManiaDifficulty extends IBanchoDifficulty {
  great_hit_window: number;
  score_multiplier: number;
}

interface IBanchoOsuDifficulty extends IBanchoDifficulty {
  aim_difficulty: number;
  approach_rate: number;
  flashlight_difficulty: number;
  overall_difficulty: number;
  slider_factor: number;
  speed_difficulty: number;
}

interface IBanchoUserCompact {
  avatar_url: string;
  country_code: string;
  default_group: string;
  id: number;
  is_active: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_online: boolean;
  is_supporter: boolean;
  last_visit: string | null;
  pm_friends_only: boolean;
  profile_colour: string | null;
  username: string;
}

interface IBanchoScore {
  id: number;
  best_id: number;
  user_id: number;
  accuracy: number;
  mods: string[];
  score: number;
  max_combo: number;
  perfect: boolean;
  statistics: IBanchoHitStatistics;
  passed: boolean;
  pp: number | null;
  rank: keyof typeof ScoreRank;
  created_at: string;
  mode: Lowercase<keyof typeof GameMode>;
  mode_int: GameMode;
  replay: boolean;
  beatmap?: IBanchoBeatmap | IBanchoBeatmapCompact;
  user?: IBanchoUserCompact;
}

interface IBanchoTaikoDifficulty extends IBanchoDifficulty {
  stamina_difficulty: number;
  rhythm_difficulty: number;
  colour_difficulty: number;
  approach_rate: number;
  great_hit_window: number;
}

interface IBanchoUser extends IBanchoUserCompact {
  playmode: Lowercase<keyof typeof GameMode>;
}

declare class BanchoAuthTokens extends AuthTokens {
  constructor(tokens: IBanchoAuthTokens);
}

declare class BanchoBeatmapInfo extends BeatmapInfo {
  constructor(other: IBanchoBeatmapCompact | IBanchoBeatmap);
}

declare class BanchoCatchDifficultyAttributes extends CatchDifficultyAttributes {
  constructor(other: IBanchoCatchDifficulty, mods?: string | number);
}

declare class BanchoManiaDifficultyAttributes extends ManiaDifficultyAttributes {
  constructor(other: IBanchoManiaDifficulty, mods?: string | number);
}

declare class BanchoOsuDifficultyAttributes extends StandardDifficultyAttributes {
  constructor(other: IBanchoOsuDifficulty, mods?: string | number);
}

declare class BanchoScoreInfo extends ScoreInfo {
  constructor(other: IBanchoScore);
}

declare class BanchoTaikoDifficultyAttributes extends TaikoDifficultyAttributes {
  constructor(other: IBanchoTaikoDifficulty, mods?: string | number);
}

declare class BanchoUserInfo extends UserInfo {
  constructor(other: IBanchoUserCompact | IBanchoUser);
}

declare class BanchoURLGenerator extends URLGenerator {
  /**
     * Base link to the osu! website.
     */
  readonly SERVER_ROOT = 'https://osu.ppy.sh';
  /**
     * Base link to the osu! api v2.
     */
  readonly API_ROOT: string;
  /**
     * Base link to the osu! authorization tokens.
     */
  readonly TOKEN_ROOT: string;
  /**
     * Base link to the osu! authorization.
     */
  readonly AUTHORIZE_ROOT: string;
  /**
     * Generates a beatmapset URL by beatmapset ID.
     * @param user Beatmapset ID.
     * @returns Generated beatmapset URL.
     */
  generateBeatmapsetURL(beatmapsetId: string | number): string;
  generateTokenURL(): string;
  generateAuthLink(state?: string): string;
  generateBeatmapInfoURL(options: IBeatmapRequestOptions): string;
  generateBeatmapsetSearchURL(options: IBeatmapRequestOptions): string;
  generateScoreInfoURL(options: IScoreRequestOptions): string;
  generateUserBestURL(options: IScoreListRequestOptions): string;
  generateUserRecentURL(options: IScoreListRequestOptions): string;
  generateUserFirstsURL(options: IScoreListRequestOptions): string;
  private _generateUserScoresURL;
  generateBeatmapScoresURL(options: ILeaderboardRequestOptions): string;
  generateUserInfoURL(options: IUserRequestOptions): string;
  generateDifficultyURL(options: IDifficultyRequestOptions): string;
}

/**
 * A wrapper for Bancho API v2.
 */
declare class BanchoAPIClient extends APIClientWithOAuth implements IHasAttributes, IHasBeatmaps, IHasLeaderboard, IHasRecent, IHasScores, IHasTop, IHasUsers {
  /**
     * Bancho URL generator.
     */
  readonly urlGenerator: BanchoURLGenerator;
  /**
     * Cached pairs of username & user ID.
     */
  private _users;
  /**
     * Authorizes to the API.
     * @returns If authorization was successful or not.
     */
  authorize(): Promise<boolean>;
  getBeatmap(options?: IBeatmapRequestOptions): Promise<BanchoBeatmapInfo | null>;
  getScore(options?: IScoreRequestOptions): Promise<BanchoScoreInfo | null>;
  getLeaderboard(options?: ILeaderboardRequestOptions): Promise<BanchoScoreInfo[]>;
  getUserBest(options?: IScoreListRequestOptions): Promise<BanchoScoreInfo[]>;
  getUserRecent(options?: IScoreListRequestOptions): Promise<BanchoScoreInfo[]>;
  getUser(options?: IUserRequestOptions): Promise<BanchoUserInfo | null>;
  getDifficulty(options?: IDifficultyRequestOptions): Promise<DifficultyAttributes | null>;
  /**
     * Creates adapted difficulty attributes for specific ruleset.
     * @param data Response data with difficulty information.
     * @param options Difficulty request options.
     * @returns Adapted difficulty attributes.
     */
  private _createAttributes;
  /**
     * Performs a request to the API to get a list of scores.
     * @param url URL to the list of scores.
     * @returns A list of adapted scores.
     */
  private _getScores;
  /**
     * This exists only because not all endpoints can work with usernames.
     * Although this client performs caching, new users
     * still require an additional request to the API.
     * @param target Username or user ID.
     * @returns User ID.
     */
  private _getUserId;
}

declare class BanchoURLScanner extends URLScanner {
  /**
     * Name of this server.
     */
  readonly SERVER_NAME = 'Bancho';
  readonly BASE_REGEX: RegExp;
  readonly USER_REGEX: RegExp;
  readonly BEATMAP_REGEX: RegExp;
  readonly BEATMAPSET_REGEX: RegExp;
  readonly BEATMAP_WITH_SET_REGEX: RegExp;
  readonly SCORE_REGEX: RegExp;
  /**
     * Searches for beatmapset URL in the text.
     * @param text Input text.
     * @returns Result of search.
     */
  hasBeatmapsetURL(text?: string | null): boolean;
  isBeatmapURL(url?: string | null): boolean;
  isBeatmapURLWithRuleset(url?: string | null): boolean;
  /**
     * Checks if specified URL is beatmapset URL.
     * @param url Target URL.
     * @returns Result of cheking.
     */
  isBeatmapsetURL(url?: string | null): boolean;
  getRulesetIdFromURL(url?: string | null): GameMode;
  getBeatmapsetIdFromURL(url?: string | null): number;
}

/**
 * Searches for target beatmap in a list of bancho beatmapsets by a query.
 * @param beatmapsets The list of found beatmapsets.
 * @param query Search query.
 * @returns Found beatmap or null.
 */
declare function searchBeatmap(beatmapsets: IBanchoBeatmapset[], query?: string): IBanchoBeatmap | null;

/**
 * Tries to find server name by input value.
 * @param input Input value.
 * @returns Server name or null.
 */
declare function getServerName(input?: string | null): keyof typeof Server | null;

/**
 * An API factory.
 */
declare class APIFactory {
  /**
     * Creates a new API client based on a server name.
     * @param server Server name.
     * @returns API client.
     */
  getAPIClient(server?: keyof typeof Server | null): APIClient | APIClientWithOAuth;
  /**
     * Adds credentials to the specific server API.
     * @param server Server name.
     * @param clientId API client ID.
     * @param clientSecret API client secret.
     */
  addCredentials(server?: keyof typeof Server | null, clientId?: string, clientSecret?: string): void;
  /**
     * Creates a new instance of URL scanner based on a server name.
     * @param server Server name.
     * @returns URL scanner.
     */
  createURLScanner(server?: keyof typeof Server | null): URLScanner;
  /**
     * Creates a new instance of URL generator based on a server name.
     * @param server Server name.
     * @returns URL generator.
     */
  createURLGenerator(server?: keyof typeof Server | null): URLGenerator;
}
declare const _default: APIFactory;

export { APICache, APIClient, APIClientWithOAuth, _default as APIFactory, AuthTokens, BanchoAPIClient, BanchoAuthTokens, BanchoBeatmapInfo, BanchoCatchDifficultyAttributes, BanchoManiaDifficultyAttributes, BanchoOsuDifficultyAttributes, BanchoScoreInfo, BanchoTaikoDifficultyAttributes, BanchoURLGenerator, BanchoURLScanner, BanchoUserInfo, GameMode, IAPIResponse, IBanchoAuthTokens, IBanchoBeatmap, IBanchoBeatmapCompact, IBanchoBeatmapset, IBanchoBeatmapsetCompact, IBanchoCatchDifficulty, IBanchoDifficulty, IBanchoHitStatistics, IBanchoManiaDifficulty, IBanchoOsuDifficulty, IBanchoScore, IBanchoTaikoDifficulty, IBanchoUser, IBanchoUserCompact, IBeatmapRequestOptions, ICachedResponse, IDifficultyRequestOptions, IHasAttributes, IHasBeatmaps, IHasLeaderboard, IHasRecent, IHasScores, IHasTop, IHasUsers, ILeaderboardRequestOptions, IScoreListRequestOptions, IScoreRequestOptions, IUserRequestOptions, RankStatus, ScoreType, Server, SortingType, URLGenerator, URLScanner, getRuleset, getRulesetId, getServerName, searchBeatmap, sortUserBest };
