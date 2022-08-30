import { LeagueCodesInverse } from "./LeagueCodes";

export default function getMatchPoints(match: Results.Match): number {
  if (
    LeagueCodesInverse[match?.league?.id] === "mlsnp" &&
    match.status.short === "PEN"
  ) {
    return match.score.penalty[match.home ? "home" : "away"] >
      match.score.penalty[match.home ? "away" : "home"]
      ? 2
      : 1;
  }

  return getPointsForResult(match.result);
}

export function getPointsForResult(result: Results.ResultType) {
  return result === "W" ? 3 : result === "D" ? 1 : 0;
}
