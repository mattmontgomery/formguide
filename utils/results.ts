import { colors } from "@mui/material";

export function getInverseResult(
  result: Results.ResultType,
): Results.ResultType {
  return result === null
    ? null
    : result === "W"
      ? "L"
      : result === "L"
        ? "W"
        : "D";
}
export function stepResult(result: Results.ResultType): Results.ResultType {
  if (result === "W") {
    return "D";
  } else if (result === "D") {
    return "L";
  } else if (result === "L") {
    return null;
  } else {
    return "W";
  }
}

export function getResultBackgroundColor(result?: Results.ResultType): string {
  return !result
    ? "background.default"
    : result === "W"
      ? "success.main"
      : result === "L"
        ? "error.main"
        : "warning.main";
}
export function getResultGradient(
  value: number,
  scale: number[],
  colors: string[],
  distanceCheck: (value: number, scaleValue: number) => boolean = (
    value,
    scaleValue,
  ) => value - scaleValue <= 5,
): string {
  // find the closest number in the scale
  const scaleValue = scale.find((scaleValue) => {
    return distanceCheck(value, scaleValue);
  });
  return colors[scale.findIndex((s) => s == scaleValue)];
}

export function getMinutesColor(value: number): string {
  if (value === 0) {
    return colors.indigo["100"];
  }
  return getResultGradient(
    value,
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    [
      colors.red["300"],
      colors.orange["400"],
      colors.orange["200"],
      colors.amber["700"],
      colors.amber["500"],
      colors.amber["300"],
      colors.green["200"],
      colors.green["300"],
      colors.green["400"],
      colors.green["500"],
      colors.green["500"],
    ],
  );
}

export function getSmallStatsColor(value: number): string {
  if (value === 0) {
    return colors.indigo["100"];
  }
  return getResultGradient(
    value,
    [0, 1, 2, 3, 4],
    [
      colors.indigo["100"],
      colors.green["400"],
      colors.amber["400"],
      colors.orange["400"],
      colors.purple["400"],
      colors.deepPurple["400"],
    ],
    (value, scaleValue) => value === scaleValue,
  );
}
