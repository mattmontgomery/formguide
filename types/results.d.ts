declare namespace Results {
  declare type RawData = {
    response: {
      fixture: {
        date: string;
        status: {
          long: string;
          short: string;
          elapsed: number;
        };
      };
      league: {};
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
      goals: {
        home: number;
        away: number;
      };
    }[];
  };

  declare type ParsedData = {
    teams: Record<string, Array<Match>>;
  };
  declare type Match = {
    scoreline: string | null;
    date: string;
    home: boolean;
    result: ResultType;
    team: string;
    opponent: string;
    opponentLogo: string;
  };
}
