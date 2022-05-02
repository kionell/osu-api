export interface IScoreListRequestOptions {
  user: string | number;
  mode?: number,
  mods?: string | number;
  limit?: number,
  offset?: number,
  includeFails?: boolean;
}
