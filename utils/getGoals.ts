export function getFirstGoalScored(match: Results.MatchWithGoalData) {
  return match.goalsData?.goals.find((g) => g.team.name === match.team);
}
export function getFirstGoalConceded(match: Results.MatchWithGoalData) {
  return match.goalsData?.goals.find((g) => g.team.name !== match.team);
}
