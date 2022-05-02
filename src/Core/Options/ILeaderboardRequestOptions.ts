export interface ILeaderboardRequestOptions {
  beatmapId: string | number,
  mode?: number,
  user?: string | number,
  mods?: string;
  limit?: number,
}
