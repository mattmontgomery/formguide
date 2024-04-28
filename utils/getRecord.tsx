import { isAfter, isBefore } from "date-fns";

export type RecordPoints = [number, number, number];
export type RecordGoals = [number, number, number];
export function getRecord(
  matches: Results.Match[],
  {
    home = null,
    away = null,
    from = null,
    to = null,
  }: Partial<{
    home: boolean | null;
    away: boolean | null;
    from: Date | null;
    to: Date | null;
  }> = {}
): RecordPoints {
  return (matches ?? [])
    .filter(
      (match) =>
        match.status.long === "Match Finished" &&
        ((home !== null ? match.home === home : true) ||
          (away !== null ? !match.home === away : true))
    )
    .filter((match) => (from ? isAfter(new Date(match.rawDate), from) : true))
    .filter((match) => (to ? isBefore(new Date(match.rawDate), to) : true))
    .reduce(
      (prev, curr) => {
        return curr
          ? [
              prev[0] + (curr.result === "W" ? 1 : 0),
              prev[1] + (curr.result === "D" ? 1 : 0),
              prev[2] + (curr.result === "L" ? 1 : 0),
            ]
          : prev;
      },
      [0, 0, 0]
    );
}

/**
 *
 * @return [goalsFor, goalsAgainst, goalDifference]
 */
export function getGoals(matches: Results.Match[]): RecordGoals {
  return (matches ?? [])
    .filter((match) => match.status.long === "Match Finished")
    .reduce(
      (prev, curr) => {
        return curr
          ? [
              prev[0] + (curr.goalsScored ?? 0),
              prev[1] + (curr.goalsConceded ?? 0),
              prev[2] + ((curr.goalsScored ?? 0) - (curr.goalsConceded ?? 0)),
            ]
          : prev;
      },
      [0, 0, 0]
    );
}

export function getRecordPoints(record: RecordPoints): number {
  return record[0] * 3 + record[1];
}
