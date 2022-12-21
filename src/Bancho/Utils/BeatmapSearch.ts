import type { IBanchoBeatmap, IBanchoBeatmapset } from '../Interfaces';

/**
 * Searches for target beatmap in a list of bancho beatmapsets by a query.
 * @param beatmapsets The list of found beatmapsets.
 * @param query Search query.
 * @returns Found beatmap or null.
 */
export function searchBeatmap(beatmapsets: IBanchoBeatmapset[], query?: string): IBanchoBeatmap | null {
  if (!beatmapsets || !query) return null;

  // Split query by spaces and convert all keywords to lower case.
  const keywords = query.toLowerCase().split(' ');

  for (const beatmapset of beatmapsets) {
    if (!beatmapset.beatmaps) continue;

    const beatmaps = beatmapset.beatmaps;

    const title = beatmapset.title.toLowerCase();
    const artist = beatmapset.artist.toLowerCase();
    const creator = beatmapset.creator.toLowerCase();
    const tags = beatmapset.tags.toLowerCase();

    // Search through every beatmap in the beatmapset.
    for (let i = beatmaps.length - 1; i >= 0; --i) {
      beatmaps[i].beatmapset = beatmapset;

      const hasSameId = parseInt(keywords[0]) === beatmaps[i].id;

      // Found by exact match of beatmap ID.
      if (keywords.length === 1 && hasSameId) return beatmaps[i];

      const hasSameHash = keywords[0] === beatmaps[i].checksum?.toLowerCase();

      // Found by exact match of beatmap hash.
      if (keywords.length === 1 && hasSameHash) return beatmaps[i];

      const version = beatmaps[i].version.toLowerCase();

      /**
       * Use next priority:
       *  1) Difficulty name.
       *  2) Beatmap creator.
       *  3) Beatmap title.
       *  4) Beatmap artist.
       */
      if (hasAllKeywords(version, keywords)) return beatmaps[i];
      if (hasAllKeywords(creator, keywords)) return beatmaps[i];
      if (hasAllKeywords(title, keywords)) return beatmaps[i];
      if (hasAllKeywords(artist, keywords)) return beatmaps[i];

      const targetName = `${artist} - ${title} (${creator}) [${version}] ${tags}`;

      // Found all keywords.
      if (hasAllKeywords(targetName, keywords)) return beatmaps[i];
    }
  }

  // Return last difficulty from the first beatmapset if found any.
  if (beatmapsets.length && beatmapsets[0].beatmaps?.length) {
    return beatmapsets[0].beatmaps[beatmapsets[0].beatmaps.length - 1];
  }

  return null;
}

/**
 * @param text Text to search in.
 * @param keywords Keywords for search.
 * @returns If text has all keywords.
 */
function hasAllKeywords(text: string, keywords: string[]): boolean {
  for (const keyword of keywords) {
    if (!text.includes(keyword)) return false;
  }

  return true;
}
