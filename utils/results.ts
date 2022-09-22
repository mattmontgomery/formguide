export function getInverseResult(
  result: Results.ResultType
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

export function getResultBackgroundColor(result?: Results.ResultType) {
  return !result
    ? "background.default"
    : result === "W"
    ? "success.main"
    : result === "L"
    ? "error.main"
    : "warning.main";
}
