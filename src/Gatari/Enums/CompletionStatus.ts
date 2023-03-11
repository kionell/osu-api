export enum CompletionStatus {
  LowerScoreAndPP = 2, // Means neither highest by PP nor score
  HighestPP = 3, // Means highest PP score
  HighestScore = 4, // Means highest score by score, but not highest by PP
}
