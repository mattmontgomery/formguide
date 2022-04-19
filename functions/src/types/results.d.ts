declare namespace Results {
  type RawResponse = {
    fixture: {
      id: number;
      date: string;
      status: {
        long: string;
        short: string;
        elapsed: number;
      };
    };
    league: League & {
      round: string;
    };
    teams: Record<
      "home" | "away",
      {
        id: number;
        name: string;
        logo: string;
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
  type Match = {
    scoreline: string | null;
    score: {
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
    status: RawResponse["fixture"]["status"];
    league: RawResponse["league"];
    date: string;
    rawDate?: Date | string;
    home: boolean;
    result: ResultType;
    team: string;
    opponent: string;
    opponentLogo: string;
    gd?: number;
    firstHalf?: MatchGoals;
    secondHalf?: MatchGoals;
  } & MatchGoals;
  type MatchGoals = {
    goalsScored?: number;
    goalsConceded?: number;
    result: ResultType;
  };
  type ResultType = "W" | "D" | "L" | null;
  type League = {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
  };
  type Team = {
    id: number;
    name: string;
  };
  type Totals<T = number> = { home: T; away: T; total: T };

  type Fixture = {
    predictions: {
      winner: Results.Team & { comment: string };
      win_or_draw: boolean;
      over_under: string;
      goals: {
        home: unknown;
        away: unknown;
      };
      advice: string;
      percent: string;
    };
    league: Results.League;
    teams: Record<
      "home" | "away",
      Results.Team & {
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
      fixture: {
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
    | "wsl";
}
