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
      goals: RawMatchGoals;
      score: {
        halftime: RawMatchGoals;
        fulltime: RawMatchGoals;
        extratime: RawMatchGoals;
        penalty: RawMatchGoals;
      };
    }[];
  };
  declare type RawMatchGoals = {
    home: number;
    away: number;
  };

  declare type ParsedData = {
    teams: Record<string, Match[]>;
  };
  declare type Match = {
    scoreline: string | null;
    date: string;
    rawDate?: date;
    home: boolean;
    result: ResultType;
    team: string;
    opponent: string;
    opponentLogo: string;
    gd?: number;
    firstHalf?: MatchGoals;
    secondHalf?: MatchGoals;
  } & MatchGoals;
  declare type MatchGoals = {
    goalsScored?: number;
    goalsConceded?: number;
    result: ResultType;
  };
  declare type ResultType = "W" | "D" | "L" | null;

  declare type RenderReadyData = [string, ...React.ReactElement[]][];

  declare type ParserFunction = (
    teams: Results.ParsedData["teams"]
  ) => Results.RenderReadyData;
}
