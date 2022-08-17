import { LeagueCodesInverse } from "./LeagueCodes";

export default function getMatchPoints(match: Results.Match): number {
  const result = match.result;
  if (
    LeagueCodesInverse[match?.league?.id] === "mlsnp" &&
    match.status.short === "PEN"
  ) {
    return match.score.penalty[match.home ? "home" : "away"] >
      match.score.penalty[match.home ? "away" : "home"]
      ? 2
      : 1;
  }

  return result === "W" ? 3 : result === "D" ? 1 : 0;
}
