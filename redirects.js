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
// Order matters: more specific paths must come before generic ones, since
// Next.js applies the first matching rule.
const PATH_RULES = [
  // Projections / simulated standings
  {
    from: "/projected/points",
    to: (league) => `/simulated/${league}`,
  },
  {
    from: "/projected-standings",
    to: (league) => `/simulated/${league}`,
  },
  {
    from: "/projections",
    to: (league) => `/simulated/${league}`,
  },

  // Standings / table
  {
    from: "/table/chart",
    to: (league) => `/over-time/${league}`,
  },
  {
    from: "/table/position",
    to: (league) => `/standings/${league}`,
  },
  {
    from: "/table/advanced",
    to: (league) => `/standings/${league}`,
  },
  {
    from: "/table",
    to: (league) => `/standings/${league}`,
  },
  {
    from: "/record/since/:date",
    to: (league) => `/standings/${league}`,
  },

  // Over-time (cumulative points / position chart)
  {
    from: "/points/cumulative",
    to: (league) => `/over-time/${league}`,
  },

  // Rolling form (chart-style with a period)
  {
    from: "/chart/:period",
    to: (league, params) => `/rolling/${league}?period=${params.period}`,
  },
  {
    from: "/gf-chart/:period",
    to: (league, params) => `/rolling/${league}?period=${params.period}`,
  },
  {
    from: "/ga-chart/:period",
    to: (league, params) => `/rolling/${league}?period=${params.period}`,
  },
  {
    from: "/gd-chart/:period",
    to: (league, params) => `/rolling/${league}?period=${params.period}`,
  },
  {
    from: "/xg/rolling/:stat/:period",
    to: (league, params) => `/rolling/${league}?period=${params.period}`,
  },
  {
    from: "/first-goal/rolling/:type/:period",
    to: (league, params) => `/rolling/${league}?period=${params.period}`,
  },
  {
    from: "/stats/rolling/finishing",
    to: (league) => `/rolling/${league}`,
  },
  {
    from: "/stats/rolling/:type",
    to: (league) => `/rolling/${league}`,
  },

  // League stats (xG / GF / GA / GD / scatter / comparison / finishing)
  {
    from: "/stats/comparison/:type",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/stats/finishing",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/stats/scatter/:type",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/stats/:type",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/xg/for",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/xg/against",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/xg/difference",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/gf",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/ga",
    to: (league) => `/stats/${league}`,
  },
  {
    from: "/gd",
    to: (league) => `/stats/${league}`,
  },

  // Player stats (player-minutes lives at the league-agnostic /stats route)
  {
    from: "/player-minutes/:team/rolling",
    to: () => `/stats`,
  },
  {
    from: "/player-minutes/:team",
    to: () => `/stats`,
  },
  {
    from: "/player-minutes",
    to: () => `/stats`,
  },

  // Versus / head-to-head
  {
    from: "/versus/gd",
    to: (league) => `/h2h/${league}`,
  },
  {
    from: "/versus/record",
    to: (league) => `/h2h/${league}`,
  },
  {
    from: "/versus",
    to: (league) => `/h2h/${league}`,
  },

  // Fixtures -> schedule
  {
    from: "/fixtures/today",
    to: (league) => `/schedule/${league}`,
  },
  {
    from: "/fixtures",
    to: (league) => `/schedule/${league}`,
  },

  // Strength of schedule (approximate match for opponent-PPG view)
  {
    from: "/ppg/opponent",
    to: (league) => `/strength-of-schedule/${league}`,
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
