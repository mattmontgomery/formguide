declare namespace Results {
  type RawResponse = {
    fixture: {
      id: number;
      date: string;
      status: {
        long: string | "Match Finished";
        short: string;
        elapsed: number;
      };
    };
    league: League & {
      round?: string;
    };
    teams: Record<
      "home" | "away",
      Team & {
        winner: boolean;
      }
    >;
    goals: RawMatchGoals;
    score: Record<
      "halftime" | "fulltime" | "extratime" | "penalty",
      RawMatchGoals
    >;
  };
  type RawData = {
    response: RawResponse[];
  };
  type RawMatchGoals = Record<"home" | "away", number>;

  type ParsedData = {
    teams: Record<string, Match[]>;
  };
  type ParsedDataGoals = {
    teams: Record<string, MatchWithGoalData[]>;
  };
  type ParsedDataStats = {
    teams: Record<string, MatchWithStatsData[]>;
  };
  type ParsedMeta = { league: Results.Leagues; year: number };
  type Scoreline = {
    halftime: {
      home: number;
      away: number;
    };
    fulltime: {
      home: number;
      away: number;
    };
    extratime: {
      home: number;
      away: number;
    };
    penalty: {
      home: number;
      away: number;
    };
  };
  type Match = {
    fixtureId: number;
    scoreline: string | null;
    score: Scoreline;
    asa?: ASA.XGWithGame;
    status: RawResponse["fixture"]["status"];
    league?: RawResponse["league"];
    date: string;
    rawDate: string;
    home: boolean;
    result: ResultType;
    team: string;
    opponent: string;
    opponentLogo: string;
    gd?: number;
    firstHalf?: MatchGoals;
    secondHalf?: MatchGoals;
  } & MatchGoals;
  type MatchWithGoalData = Match & {
    goalsData?: {
      fixtureId: number;
      fromCache: boolean;
      goals: FixtureEvent[];
      substitutions: FixtureEvent[];
      penalties: Record<
        string,
        {
          scored: number;
          missed: number;
        }
      >;
    };
  };
  type MatchWithStatsData = {
    stats?: {
      [team: string]: Record<string, number | string>;
    };
  } & Match;
  type MatchGoals = {
    goalsScored?: number;
    goalsConceded?: number;
    result: ResultType;
  };
  type ResultTypes = "W" | "D" | "L";
  type ResultTypesAll = ResultTypes | "all";
  type ResultType = ResultTypes | null;
  type League = {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round?: string;
  };
  type Team = {
    id: number;
    name: string;
    logo: string;
  };
  type Totals<T = number> = { home: T; away: T; total: T };
  type Fixture = {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number;
      second: number;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: RawResponse["fixture"]["status"];
  };
  type FixtureEvent = {
    time: { elapsed: number; extra: number };
    team: Pick<Team, "id" | "name" | "logo">;
    player: {
      id: number;
      name: string;
    };
    assist?: {
      id: number;
      name: string;
    };
    type: "subst" | "Card" | "Goal";
    detail: string;
    comments: string | null;
  };
  type FixtureApi = {
    fixture: Fixture;
    league: League;
    teams: Record<"home" | "away", Team>;
    goals: Record<"home" | "away", number>;
    score: Results.Scoreline;
    events: FixtureEvent[];
    lineups: {
      team: Pick<Team, "id" | "name" | "logo"> & {
        colors: Record<
          "player" | "goalkeeper",
          Record<"primary" | "number" | "border", string>
        >;
      };
      coach: {
        id: number;
        name: string;
        photo: string;
      };
      formation: string;
      startXI: {
        player: {
          id: number;
          name: string;
          number: number;
          pos: "G" | "D" | "M" | "F";
          grid: string | null;
        };
      }[];
      substitutes: {
        player: {
          id: number;
          name: string;
          number: number;
          pos: "G" | "D" | "M" | "F";
          grid: string | null;
        };
      }[];
    }[];
    statistics: {
      team: Pick<Team, "id" | "name" | "logo">;
      statistics: { type: string; value: number | string }[];
    }[];
    players: {
      team: Results.Team;
      players: {
        player: {
          id: number;
          name: string;
          photo: string;
        };
        statistics: {
          games: {
            minutes: number;
            number: number;
            position: string;
            rating: string;
            captain: boolean;
            substitute: boolean;
          };
          offsides: number;
          shots: {
            total: number;
            on: number;
          };
          goals: {
            total: number | null;
            conceded: number | null;
            assists: number | null;
            saves: number | null;
          };
          passes: {
            total: number | null;
            key: number | null;
            accuracy: string;
          };
          tackles: {
            total: number | null;
            blocks: number | null;
            interceptions: number | null;
          };
          duels: {
            total: number | null;
            won: number | null;
          };
          dribbles: {
            attempts: number | null;
            success: number | null;
            past: number | null;
          };
          fouls: {
            drawn: number | null;
            committed: number | null;
          };
          cards: {
            yellow: number;
            red: number;
          };
          penalty: {
            won: number | null;
            commited: number | null;
            scored: number;
            missed: number;
            saved: number;
          };
        }[];
      }[];
    }[];
  };
  type PredictionApi = {
    predictions: {
      winner: Results.Team & { comment: string };
      win_or_draw: boolean;
      under_over: string;
      goals: {
        home: unknown;
        away: unknown;
      };
      advice: string;
      percent: Record<"home" | "draw" | "away", string>;
    };
    league: League;
    teams: Record<
      "home" | "away",
      Team & {
        last_5: {
          form: string;
          att: string;
          def: string;
          goals: {
            for: {
              total: number;
              average: number;
            };
            against: {
              total: number;
              average: number;
            };
          };
        };
        league: {
          form: string;
          fixtures: Record<"played" | "wins" | "draws" | "losses", Totals>;
          goals: Record<
            "for" | "against",
            {
              total: Totals;
              average: Totals<string>;
              minute: Record<
                string,
                { total: string | null; percentage: string | null }
              >;
            }
          >;
          biggest: {
            streak: Totals;
            wins: Record<"home" | "away", string>;
            loses: Record<"home" | "away", string>; // sic
            goals: Record<"for" | "against", Record<"home" | "away", number>>;
          };
          clean_sheet: Totals;
          failed_to_score: Totals;
          penalty: Record<
            "scored" | "missed",
            {
              total: number;
              percentage: string;
            }
          > & {
            total: number;
          };
          lineups: { formation: string; played: number }[];
          cards: Record<
            "yellow" | "red",
            Record<string, { total: number; percentage: string }>
          >;
        };
      }
    >;
    comparison: Record<
      | "form"
      | "att"
      | "def"
      | "poisson_distribution"
      | "h2h"
      | "goals"
      | "total",
      Record<"home" | "away", string>
    >;
    h2h: {
      fixture: Fixture;
      league: RawResponse["league"];
      teams: RawResponse["teams"];
      goals: RawMatchGoals;
      score: RawResponse["score"];
    }[];
  };
  type Leagues =
    | "mls"
    | "nwsl"
    | "mlsnp"
    | "usl1"
    | "usl2"
    | "uslc"
    | "nisa"
    | "epl"
    | "ligamx"
    | "ligamx_ex";
}

/**
 *
TBD : Time To Be Defined
NS : Not Started
1H : First Half, Kick Off
HT : Halftime
2H : Second Half, 2nd Half Started
ET : Extra Time
P : Penalty In Progress
FT : Match Finished
AET : Match Finished After Extra Time
PEN : Match Finished After Penalty
BT : Break Time (in Extra Time)
SUSP : Match Suspended
INT : Match Interrupted
PST : Match Postponed
CANC : Match Cancelled
ABD : Match Abandoned
AWD : Technical Loss
WO : WalkOver
LIVE : In Progress *
 */
