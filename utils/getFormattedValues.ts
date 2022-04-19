import { format, parseISO } from "date-fns";

export function getFormattedDate(
  match: Results.Fixture,
  showTime = true
): string {
  return typeof match.date === "string"
    ? format(
        parseISO(match.date),
        `eee., MMM d, Y${showTime ? ", K:mm aaaa z" : ""}`
      )
    : "";
}
