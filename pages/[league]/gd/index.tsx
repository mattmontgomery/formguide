import MatchCell from "@/components/MatchCell";
import BasePage from "@/components/BaseGridPage";

export default function GoalDifference(): React.ReactElement {
  return <BasePage pageTitle="Goal Difference" dataParser={dataParser} />;
}
function dataParser(data: Results.ParsedData["teams"]): Render.RenderReadyData {
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => (
        <MatchCell
          match={match}
          key={idx}
          renderValue={() => (typeof match.gd !== "undefined" ? match.gd : "-")}
        />
      )),
  ]);
}
