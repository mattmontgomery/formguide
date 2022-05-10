import { format } from "util";

type PastTenseResult = "Won" | "Lost" | "Drew";

const PastTenseFormatMap: Record<Results.ResultTypes, PastTenseResult> = {
  D: "Drew",
  L: "Lost",
  W: "Won",
};

export function getPastTense(match: Results.Match): PastTenseResult | null {
  return match.result ? PastTenseFormatMap[match.result] : null;
}

export function getMatchDescriptor(match: Results.Match): string {
  return format(
    `%s %d - %d %s`,
    match.home ? match.team : match.opponent,
    match.score.fulltime[match.home ? "home" : "away"],
    match.score.fulltime[!match.home ? "home" : "away"],
    match.home ? match.opponent : match.team
  );
}
