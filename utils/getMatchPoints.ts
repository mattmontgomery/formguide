export default function getMatchPoints(result: Results.ResultType): number {
  return result === "W" ? 3 : result === "D" ? 1 : 0;
}
