export type RecordPoints = [number, number, number];

export function getRecord(matches: Results.Match[]): RecordPoints {
  return matches
    .filter((match) => match.status.long === "Match Finished")
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

export function getRecordPoints(record: RecordPoints): number {
  return record[0] * 3 + record[1];
}
