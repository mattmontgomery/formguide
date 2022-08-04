import { getArraySum } from "./array";
import getMatchPoints from "./getMatchPoints";

export default function getTeamPoints(
  data: Results.ParsedData["teams"]
): Record<
  string,
  { date: Date; points: number; result: Results.ResultType; home: boolean }[]
> {
  return Object.keys(data).reduce((acc, team) => {
    return {
      ...acc,
      [team]: data[team].map((match) => ({
        date: new Date(match.date),
        points: getMatchPoints(match),
        result: match.result,
        home: match.home,
      })),
    };
  }, {});
}

export function getTeamPointsArray(matches: Results.Match[]): number[] {
  return matches.map(getMatchPoints);
}

export function getCumulativeTeamPointsArray(
  matches: Results.Match[]
): number[] {
  const points = matches.map(getMatchPoints);
  const cumulativePoints = points.map((_, idx) => {
    return getArraySum(points.slice(0, idx));
  });
  return cumulativePoints;
}
