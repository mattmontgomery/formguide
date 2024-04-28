import { getArraySum } from "./array";
import { getTeamPointsArray } from "./getTeamPoints";

export default function getPPG(
  data: Results.ParsedData["teams"],
): Record<string, { home: number; away: number }> {
  return Object.entries(data)
    .map(([team, matches]): [string, { home: number; away: number }] => {
      const homePoints = getTeamPointsArray(matches.filter((m) => m.home));
      const awayPoints = getTeamPointsArray(matches.filter((m) => !m.home));
      return [
        team,
        {
          home: getArraySum(homePoints) / homePoints.length,
          away: getArraySum(awayPoints) / awayPoints.length,
        },
      ];
    })
    .reduce((acc, [team, homeAway]) => {
      return { ...acc, [team]: homeAway };
    }, {});
}
export type Probabilities = {
  homeW: number;
  homeD: number;
  homeL: number;
  awayW: number;
  awayD: number;
  awayL: number;
};
export function getProbabilities(
  data: Results.ParsedData["teams"],
): Record<string, Probabilities> {
  return Object.entries(data)
    .map(([team, matches]): [string, Probabilities] => {
      const homeGames = getTeamPointsArray(matches.filter((m) => m.home));
      const awayGames = getTeamPointsArray(matches.filter((m) => !m.home));
      return [
        team,
        {
          homeW: homeGames.filter((p) => p === 3).length / homeGames.length,
          homeD: homeGames.filter((p) => p === 1).length / homeGames.length,
          homeL: homeGames.filter((p) => p === 0).length / homeGames.length,
          awayW: awayGames.filter((p) => p === 3).length / awayGames.length,
          awayD: awayGames.filter((p) => p === 1).length / awayGames.length,
          awayL: awayGames.filter((p) => p === 0).length / awayGames.length,
        },
      ];
    })
    .reduce((acc, [team, homeAway]) => {
      return { ...acc, [team]: homeAway };
    }, {});
}
