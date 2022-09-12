import { parseISO } from "date-fns";
import { sortByDate } from "./sort";

export function getEarliestMatch(data: Results.ParsedData) {
  return [
    ...Object.entries(data.teams).map(([, matches]) => {
      return matches[0];
    }),
  ].sort(sortByDate)?.[0];
}
export function getLatestMatch(data: Results.ParsedData) {
  return [
    ...Object.entries(data.teams).map(([, matches]) => {
      return [...matches].reverse()[0];
    }),
  ]
    .sort(sortByDate)
    .reverse()[0];
}

export function getMatchDate<T extends { rawDate: string }>(match: T) {
  return parseISO(match.rawDate);
}
