import { ConferenceDisplayNames } from "./LeagueConferences";

export const LeagueGames: Partial<Record<Results.Leagues, number>> = {
  epl: 38,
  mls: 34,
};

export const LeagueSeparators: Partial<Record<Results.Leagues, number[]>> = {
  mls: [34],
  ligamx: [17, 34],
};

export const LeagueOptions: Record<Results.Leagues, string> = {
  mls: "MLS",
  nwsl: "NWSL",
  mlsnp: "MLS Next Pro",
  uslc: "USL Championship",
  usl1: "USL League One",
  usl2: "USL League Two",
  nisa: "NISA",
  ligamx: "Liga MX",
  ligamx_ex: "Liga de Expansión MX",
  epl: "English Premier League",
};

export const LeagueProbabilities: Partial<
  Record<Results.Leagues, { homeWin: number; awayWin: number }>
> = {
  mls: {
    homeWin: 0.5,
    awayWin: 0.25,
  },
};

export const LeagueYearOffset: Partial<Record<Results.Leagues, number>> = {
  epl: 1,
};

export function getConferenceDisplayName(conference: string) {
  return ConferenceDisplayNames[conference] ?? conference;
}
