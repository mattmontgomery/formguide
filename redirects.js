// 301 redirects from legacy formguide routes to formguide.tools.football.
// Maps the old per-league route prefix (e.g. /sp_la_liga/...) to the new
// site, where the league is a path suffix (e.g. /standings/laliga).

const TARGET_HOST = "https://formguide.tools.football";

// Old league code -> new league slug on formguide.tools.football.
// Old codes that have no equivalent on the new site are intentionally omitted.
const LEAGUE_MAPPING = {
  mls: "mls",
  nwsl: "nwsl",
  mlsnp: "mlsnp",
  epl: "epl",
  ligamx: "ligamx",
  uslc: "uslchampionship",
  usl1: "uslleagueone",
  usl2: "uslleaguetwo",
  de_bundesliga: "bundesliga",
  de_frauen_bundesliga: "frauenbundesliga",
  en_fa_wsl: "fawsl",
  en_championship: "championship",
  en_league_one: "leagueone",
  en_league_two: "leaguetwo",
  en_national: "nationalleague",
  fr_ligue_1: "ligue1",
  sp_la_liga: "laliga",
  it_serie_a: "seriea",
  it_serie_a_women: "serieawomen",
};

// Each rule maps a path under /[league]/... on the old site to a path on the
// new site. `to` is a function so rules can compose the new league slug and
// any captured params (e.g. :period) however they need.
const PATH_RULES = [
  {
    from: "/projected/points",
    to: (league) => `/simulated/${league}`,
  },
  {
    from: "/table/position",
    to: (league) => `/standings/${league}`,
  },
  {
    from: "/table",
    to: (league) => `/standings/${league}`,
  },
  {
    from: "/chart/:period",
    to: (league, params) => `/rolling/${league}?period=${params.period}`,
  },
];

function buildRedirects() {
  const redirects = [];
  for (const [oldLeague, newLeague] of Object.entries(LEAGUE_MAPPING)) {
    for (const rule of PATH_RULES) {
      // Use a placeholder we substitute back so we can pass param names through
      // path-to-regexp without Next.js trying to interpret them in `destination`.
      const paramNames = [...rule.from.matchAll(/:([a-zA-Z]+)/g)].map(
        (m) => m[1],
      );
      const params = Object.fromEntries(
        paramNames.map((name) => [name, `:${name}`]),
      );
      redirects.push({
        source: `/${oldLeague}${rule.from}`,
        destination: `${TARGET_HOST}${rule.to(newLeague, params)}`,
        permanent: true,
      });
    }
  }
  return redirects;
}

module.exports = { buildRedirects, LEAGUE_MAPPING, PATH_RULES, TARGET_HOST };
