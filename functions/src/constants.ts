export const ENDPOINT = `/v3/fixtures?season=%s&league=%d`;

export const LeagueCodes: Record<Results.Leagues, number> = {
  mls: 253,
  nwsl: 254,
  mlsnp: 909,
  usl1: 489,
  usl2: 256,
  uslc: 255,
  nisa: 523,
  epl: 39,
  wsl: 146,
  ligamx: 262,
  ligamx_ex: 263,
  de_bundesliga: 78,
  de_2_bundesliga: 79,
  de_3_liga: 80,
  de_frauen_bundesliga: 82,
  sp_la_liga: 140,
  sp_segunda: 141,
  sp_primera_femenina: 142,
  en_championship: 40,
  en_league_one: 41,
  en_league_two: 42,
  en_national: 43,
  en_fa_wsl: 44,
  fr_ligue_1: 61,
  fr_ligue_2: 62,
  fr_national_1: 63,
  fr_feminine: 64,
  it_serie_a: 135,
  it_serie_b: 136,
  it_serie_a_women: 139,
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
