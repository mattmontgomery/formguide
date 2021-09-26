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
      league: unknown;
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
    gd?: number;
    goalsScored?: number;
    goalsConceded?: number;
  };
  declare type ResultType = "W" | "D" | "L" | null;

  declare type RenderReadyData = [string, ...React.ReactElement[]][];

  declare type ParserFunction = (
    teams: Results.ParsedData["teams"]
  ) => Results.RenderReadyData;
}
