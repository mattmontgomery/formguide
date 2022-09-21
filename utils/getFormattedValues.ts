import { format, formatRelative, isThisWeek, parseISO } from "date-fns";

export function getFormattedDate(
  match: Results.Fixture | Results.Match,
  showTime = true
): string {
  const date = (match as Results.Match).rawDate
    ? (match as Results.Match).rawDate
    : match.date;
  return typeof date === "string"
    ? format(parseISO(date), `eee., MMM d, Y${showTime ? ", K:mm aaaa" : ""}`)
    : "";
}
export function getFormattedTime(
  match: Results.Fixture | Results.Match
): string {
  const date = (match as Results.Match).rawDate
    ? (match as Results.Match).rawDate
    : match.date;
  return typeof date === "string" ? format(parseISO(date), "K:mm aaaa z") : "";
}

export function getFormattedEventName(event: Results.FixtureEvent): string {
  if (event.type === "subst") {
    return event.detail;
  } else if (event.type === "Card") {
    return event.detail;
  } else {
    return event.type;
  }
}

export function getMatchTitle(match: Results.Match) {
  return `${match.home ? match.team : match.opponent} ${
    match.scoreline ?? "vs."
  } ${match.home ? match.opponent : match.team}`;
}

export function getRelativeDate(
  match: Results.Fixture | Results.Match,
  showTime = true
): string {
  const date = (match as Results.Match).rawDate
    ? (match as Results.Match).rawDate
    : match.date;
  const d = parseISO(date);
  if (isThisWeek(d)) {
    return formatRelative(d, new Date());
  } else {
    return getFormattedDate(match, showTime);
  }
}
