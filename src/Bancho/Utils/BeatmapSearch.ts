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
    for (const beatmap of beatmaps) {
      beatmap.beatmapset = beatmapset;

      const hasSameId = parseInt(keywords[0]) === beatmap.id;

      // Found by exact match of beatmap ID.
      if (keywords.length === 1 && hasSameId) return beatmap;

      const hasSameHash = keywords[0] === beatmap.checksum?.toLowerCase();

      // Found by exact match of beatmap hash.
      if (keywords.length === 1 && hasSameHash) return beatmap;

      const version = beatmap.version.toLowerCase();

      /**
       * Use next priority:
       *  1) Difficulty name.
       *  2) Beatmap creator.
       *  3) Beatmap title.
       *  4) Beatmap artist.
       */
      if (hasAllKeywords(version, keywords)) return beatmap;
      if (hasAllKeywords(creator, keywords)) return beatmap;
      if (hasAllKeywords(title, keywords)) return beatmap;
      if (hasAllKeywords(artist, keywords)) return beatmap;

      const targetName = `${artist} - ${title} (${creator}) [${version}] ${tags}`;

      // Found all keywords.
      if (hasAllKeywords(targetName, keywords)) return beatmap;
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
