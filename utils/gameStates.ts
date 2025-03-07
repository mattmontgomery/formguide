export function getGameStates(match: Results.MatchWithGoalData) {
  return (match.goalsData?.goals ?? [])
    .filter((goal) => goal.detail !== "Missed Penalty")
    .reduce(
      (previousValue: number[][], currentValue) => {
        const last: number[] = [...previousValue].reverse()?.[0] ?? [0, 0];
        const isFirst = match.team === currentValue.team.name;
        const next: [number, number] = [
          isFirst ? last[0] + 1 : last[0],
          isFirst ? last[1] : last[1] + 1,
        ];
        return [...previousValue, next];
      },
      [[0, 0]],
    );
}

export function getExtremeGameState(
  match: Results.MatchWithGoalData,
  type: "best" | "worst" = "best",
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

export function getGameStatesExtended(
  match: Results.MatchWithGoalData,
): { minute: number; team: number; opponent: number }[] {
  return (match.goalsData?.goals ?? [])
    .filter((goal) => goal.detail !== "Missed Penalty")
    .reduce(
      (
        previousValue: { minute: number; team: number; opponent: number }[],
        currentValue,
      ): { minute: number; team: number; opponent: number }[] => {
        const last = [...previousValue].reverse()?.[0];
        const isFirst = match.team === currentValue.team.name;
        const next: [number, number] = [
          isFirst ? (last?.team ?? 0) + 1 : last?.team ?? 0,
          isFirst ? last?.opponent ?? 0 : (last?.opponent ?? 0) + 1,
        ];
        return [
          ...previousValue,
          {
            minute: currentValue.time.elapsed + currentValue.time.extra,
            team: next[0],
            opponent: next[1],
          },
        ];
      },
      [],
    );
}

export function getMultipleGameStateSummary(
  matches: Results.MatchWithGoalData[],
): {
  w: number;
  d: number;
  l: number;
} {
  const states = matches.map(getGameStateSummary);

  return states.reduce(
    (acc, state) => {
      // const summary;
      return { w: acc.w + state.w, d: acc.d + state.d, l: acc.l + state.l };
    },
    { w: 0, d: 0, l: 0 },
  );
}

export function getGameStateSummary(match: Results.MatchWithGoalData): {
  w: number;
  d: number;
  l: number;
} {
  const output = {
    w: 0,
    d: 0,
    l: 0,
  };
  const states = getGameStatesExtended(match);
  states.forEach((state, idx) => {
    if (idx > 0) {
      const currentResult =
        state.team > state.opponent
          ? "w"
          : state.opponent > state.team
            ? "l"
            : "d";
      output[currentResult] =
        output[currentResult] + (state.minute - states[idx - 1].minute);
    }
  });
  return output;
}
