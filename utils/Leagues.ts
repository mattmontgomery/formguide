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
