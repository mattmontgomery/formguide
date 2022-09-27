export function getGameStates(match: Results.MatchWithGoalData) {
  return (match.goalsData?.goals ?? []).reduce(
    (previousValue: number[][], currentValue) => {
      const last: number[] = [...previousValue].reverse()?.[0] ?? [0, 0];
      const isFirst = match.team === currentValue.team.name;
      const next: [number, number] = [
        isFirst ? last[0] + 1 : last[0],
        isFirst ? last[1] : last[1] + 1,
      ];
      return [...previousValue, next];
    },
    [[0, 0]]
  );
}

export function getExtremeGameState(
  match: Results.MatchWithGoalData,
  type: "best" | "worst" = "best"
) {
  const gameStates = getGameStates(match);
  return gameStates
    .sort((a, b) => {
      const [aTeam, aOpp] = a;
      const [bTeam, bOpp] = b;
      const aDiff = aTeam - aOpp;
      const bDiff = bTeam - bOpp;
      return aDiff > bDiff
        ? type === "best"
          ? 1
          : -1
        : aDiff < bDiff
        ? type === "best"
          ? -1
          : 1
        : 0;
    })
    .reverse()?.[0];
}
