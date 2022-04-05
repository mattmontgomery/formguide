import MatchCell from "@/components/MatchCell";
import BasePage from "@/components/BaseGridPage";
import getMatchPoints from "@/utils/getMatchPoints";

export default function GoalDifference(): React.ReactElement {
  return <BasePage dataParser={dataParser} pageTitle="Points (Cumulative)" />;
}
function dataParser(data: Results.ParsedData["teams"]): Render.RenderReadyData {
  const cumulative: Record<string, number[]> = {};
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => {
        cumulative[team] = cumulative[team] || [];
        cumulative[team][idx] =
          (cumulative?.[team]?.[idx - 1] || 0) + getMatchPoints(match);
        return (
          <MatchCell
            match={match}
            key={idx}
            renderValue={() => cumulative[team][idx]}
          />
        );
      }),
  ]);
}
