import type { IScoreInfo } from 'osu-classes';
import { SortingType } from '../Enums';

export function sortUserBest(scores: IScoreInfo[], order: SortingType = SortingType.Performance): IScoreInfo[] {
  switch (order) {
    case SortingType.Difficulty:
      return scores.sort((a, b) => {
        return (a.beatmap?.starRating ?? 0) - (b.beatmap?.starRating ?? 0);
      });

    case SortingType.DifficultyReverse:
      return scores.sort((a, b) => {
        return (b.beatmap?.starRating ?? 0) - (a.beatmap?.starRating ?? 0);
      });

    case SortingType.PerformanceReverse:
      return scores.sort((a, b) => (b.pp ?? 0) - (a.pp ?? 0));

    case SortingType.Date:
      return scores.sort((a, b) => Number(a.date) - Number(b.date));

    case SortingType.DateReverse:
      return scores.sort((a, b) => Number(b.date) - Number(a.date));

    case SortingType.Accuracy:
      return scores.sort((a, b) => a.accuracy - b.accuracy);

    case SortingType.AccuracyReverse:
      return scores.sort((a, b) => b.accuracy - a.accuracy);

    case SortingType.BPM:
      return scores.sort((a, b) => (a.beatmap?.bpmMode ?? 0) - (b.beatmap?.bpmMode ?? 0));

    case SortingType.BPMReverse:
      return scores.sort((a, b) => (b.beatmap?.bpmMode ?? 0) - (a.beatmap?.bpmMode ?? 0));

    case SortingType.Score:
      return scores.sort((a, b) => a.totalScore - b.totalScore);

    case SortingType.ScoreReverse:
      return scores.sort((a, b) => b.totalScore - a.totalScore);
  }

  return scores.sort((a, b) => (a.pp ?? 0) - (b.pp ?? 0));
}
