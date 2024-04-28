import MatchCell from "@/components/MatchCell";

export default function getConsecutiveGames(
  results: Results.ParsedData["teams"],
  teamNamesSorted: string[],
): Render.RenderReadyData {
  return teamNamesSorted.map((team) => {
    const collated = results[team].map((match, idx) => {
      const _futureMatches = results[team].map((m, idx) => ({
        matchIdx: idx,
        opponentIdx: teamNamesSorted.indexOf(m.opponent),
      }));
      const __futureMatches = _futureMatches.map((m, idx) => ({
        ...m,
        lastOpponentIdx: _futureMatches[idx - 1]?.opponentIdx,
        lastOpponentIdxDiff:
          m.opponentIdx - _futureMatches[idx - 1]?.opponentIdx,
      }));
      const futureMatchesIdx = __futureMatches
        .slice(idx + 1)
        .findIndex((m) => m.lastOpponentIdxDiff !== 1);
      return {
        ...match,
        futureMatches: __futureMatches
          .slice(idx + 1)
          .slice(0, futureMatchesIdx),
      };
    });

    return [
      team,
      ...collated.map((m, idx) => (
        <MatchCell
          key={idx}
          match={m}
          renderValue={() => m.futureMatches.length}
        />
      )),
    ];
  });
}
