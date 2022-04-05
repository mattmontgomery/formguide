declare namespace Render {
  type RenderReadyData = [string, ...React.ReactElement[]][];

  type ParserFunction = (
    teams: Results.ParsedData["teams"]
  ) => Render.RenderReadyData;
}
