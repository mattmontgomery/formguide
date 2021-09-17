import getMatchPoints from "./getMatchPoints";

export default function getTeamPoints(
  data: Results.ParsedData["teams"]
): Record<string, { date: Date; points: number }[]> {
  return Object.keys(data).reduce((acc, team) => {
    return {
      ...acc,
      [team]: data[team].map((match) => ({
        date: new Date(match.date),
        points: getMatchPoints(match.result),
      })),
    };
  }, {});
}
