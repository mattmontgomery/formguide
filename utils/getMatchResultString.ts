type PastTenseResult = "Won" | "Lost" | "Drew";

const PastTenseFormatMap: Record<Results.ResultTypes, PastTenseResult> = {
  D: "Drew",
  L: "Lost",
  W: "Won",
};

export function getPastTense(match: Results.Match): PastTenseResult | null {
  return match.result ? PastTenseFormatMap[match.result] : null;
}
