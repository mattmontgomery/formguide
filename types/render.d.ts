declare namespace Render {
  type RenderReadyData = [string, ...React.ReactElement[]][];

  type ParserFunction = (
    teams: Results.ParsedData["teams"]
  ) => Render.RenderReadyData;

  type RollingParser<
    T = {
      value: number | null;
      matches: Results.Match[];
    }
  > = (
    data: Results.ParsedData["teams"],
    periodLength: number
  ) => [string, ...Array<T>][];

  type GetBackgroundColor = (
    value: number | null,
    periodLength: number
  ) => string;
}
