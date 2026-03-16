import MatchCell from "@/components/MatchCell";
import BasePage from "@/components/BaseGridPage";
import getMatchPoints from "@/utils/getMatchPoints";

export default function GoalDifference(): React.ReactElement {
  return <BasePage dataParser={dataParser} pageTitle="Points off the Top" />;
}
function dataParser(data: Results.ParsedData["teams"]): Render.RenderReadyData {
  const cumulative: Record<string, number[]> = {};
  Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => {
        cumulative[team] = cumulative[team] || [];
        cumulative[team][idx] =
          (cumulative?.[team]?.[idx - 1] || 0) + getMatchPoints(match);
      }),
  ]);
  const pointsOffTop: Record<string, number[]> = {};
  Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((_, idx) => {
        const topForWeek = Object.keys(cumulative)
          .sort((a, b) => {
            return cumulative[a][idx] > cumulative[b][idx]
              ? 1
              : cumulative[a][idx] === cumulative[b][idx]
                ? 0
                : -1;
          })
          .reverse()[0];
        pointsOffTop[team] = pointsOffTop[team] || [];
        pointsOffTop[team][idx] =
          cumulative[topForWeek][idx] - cumulative[team][idx];
      }),
  ]);
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => {
        return (
          <MatchCell
            match={match}
            key={idx}
            renderValue={() => pointsOffTop[team][idx]}
          />
        );
      }),
  ]);
}
