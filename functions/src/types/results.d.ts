declare namespace Results {
  type RawResponse = {
    fixture: {
      date: string;
      status: {
        long: string;
        short: string;
        elapsed: number;
      };
    };
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string;
      season: number;
      round: string;
    };
    teams: {
      home: {
        name: string;
        logo: string;
        winner: boolean;
      };
      away: {
        name: string;
        logo: string;
        winner: boolean;
      };
    };
    goals: RawMatchGoals;
    score: {
      halftime: RawMatchGoals;
      fulltime: RawMatchGoals;
      extratime: RawMatchGoals;
      penalty: RawMatchGoals;
    };
  };
  type RawData = {
    response: RawResponse[];
  };
  type RawMatchGoals = {
    home: number;
    away: number;
  };

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
