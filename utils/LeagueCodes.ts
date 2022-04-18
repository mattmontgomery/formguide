export const LeagueCodes: Record<Results.Leagues, number> = {
  mls: 253,
  nwsl: 254,
  mlsnp: 909,
  usl1: 489,
  usl2: 256,
  uslc: 255,
  nisa: 523,
  epl: 39,
};

export const LeagueCodesInverse: Record<number, Results.Leagues> =
  Object.entries(LeagueCodes)
    .map(([league, code]) => ({
      [code]: league as Results.Leagues,
    }))
    .reduce(
      (acc, curr) => ({
        ...acc,
        ...curr,
      }),
      {}
    );
