export default function getMatchPoints(result: "W" | "D" | "L"): number {
  return result === "W" ? 3 : result === "D" ? 1 : 0;
}
