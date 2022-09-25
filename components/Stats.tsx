import getMatchPoints, { getPointsForResult } from "@/utils/getMatchPoints";
import { getInverseResult } from "@/utils/results";

export type ValidStats =
  | "points"
  | "goals"
  | "shots"
  | "shots-on-goal"
  | "blocked-shots"
  | "corner-kicks"
  | "fouls"
  | "offsides"
  | "passes"
  | "possession"
  | "shots-inside-box"
  | "shots-off-goal"
  | "shots-outside-box"
  | "passes-accurate"
  | "red-cards"
  | "yellow-cards";

export function getStatsName(stat: ValidStats): string {
  return stats[stat] ?? "Unknown Stat";
}

export const stats = {
  points: "Points",
  shots: "Total Shots",
  "blocked-shots": "Blocked Shots",
  "corner-kicks": "Corner Kicks",
  fouls: "Fouls",
  offsides: "Offsides",
  passes: "Total passes",
  "passes-accurate": "Passes accurate",
  possession: "Ball Possession",
  "shots-inside-box": "Shots insidebox",
  "shots-outside-box": "Shots outsidebox",
  "red-cards": "Red Cards",
  "yellow-cards": "Yellow Cards",
  "shots-on-goal": "Shots on Goal",
  "shots-off-goal": "Shots off Goal",
  goals: "Goals",
};

export function compareStats(
  stats: [number | string | undefined, number | string | undefined]
) {
  return typeof stats[0] === "number" || typeof stats[1] === "number"
    ? Number(stats[0] ?? 0) - Number(stats[1] ?? 0)
    : "-";
}

export function getStats(
  match: Results.MatchWithStatsData,
  stat: ValidStats
): [number | string | undefined, number | string | undefined] {
  const statName = getStatsName(stat);
  switch (stat) {
    case "possession":
      return [
        Number(String(match.stats?.[match.team]?.[statName])?.replace("%", "")),
        Number(
          String(match.stats?.[match.opponent]?.[statName])?.replace("%", "")
        ),
      ];
    case "goals":
      return [match.goalsScored, match.goalsConceded];
    case "points":
      return [
        getPointsForResult(match.result),
        getPointsForResult(getInverseResult(match.result)),
      ];
    default:
      return [
        match.stats?.[match.team]?.[statName],
        match.stats?.[match.opponent]?.[statName],
      ];
  }
}

export function getStatsMax(stat: ValidStats) {
  switch (stat) {
    case "passes":
      return 800;
    case "passes-accurate":
      return 600;
    case "corner-kicks":
      return 10;
    case "shots":
      return 25;
    case "shots-on-goal":
    case "shots-off-goal":
      return 10;
    case "shots-inside-box":
    case "shots-outside-box":
      return 20;
    case "blocked-shots":
      return 10;
    case "offsides":
      return 5;
    case "red-cards":
      return 1;
    case "yellow-cards":
      return 5;
    case "fouls":
      return 25;
    case "possession":
      return 75;
    default:
      return 20;
  }
}
