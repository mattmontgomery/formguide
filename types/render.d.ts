declare namespace Render {
  type RenderReadyData = [string, ...React.ReactElement[]][];

  type ParserFunction<T = Results.ParsedData> = (T) => Render.RenderReadyData;

  type GenericParserFunction<M> = (data: M) => Render.RenderReadyData;

  type RollingParser<
    T = {
      value: number | null;
      matches: Results.Match[];
    }
  > = (
    data: Results.ParsedData["teams"],
    periodLength: number,
    homeAway: "home" | "away" | "all"
  ) => [string, ...Array<T>][];
  type ASARollingParser<
    DataType,
    T = {
      value: number | null;
      matches: Results.Match[];
    }
  > = (
    data: DataType,
    periodLength: number,
    stat: ASA.ValidStats
  ) => [string, ...Array<T>][];

  type GetBackgroundColor = (
    value: number | null,
    periodLength: number
  ) => string;
}
