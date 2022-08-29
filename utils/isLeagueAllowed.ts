import { LeagueOptions } from "./Leagues";

export default function isLeagueAllowed(league: string): boolean {
  if (league in LeagueOptions) {
    return true;
  }
  return false;
}
