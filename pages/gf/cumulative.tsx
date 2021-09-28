import MatchCell from "../../components/MatchCell";
import BasePage from "../../components/BasePage";

export default function GoalsFor(): React.ReactElement {
  return (
    <BasePage pageTitle="Goals For | Cumulative" dataParser={dataParser} />
  );
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  const cumulativeGoals: Record<string, number[]> = {};
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => {
        cumulativeGoals[team] = cumulativeGoals[team] || [];
        cumulativeGoals[team][idx] =
          (cumulativeGoals?.[team]?.[idx - 1] || 0) +
          (typeof match.goalsScored === "number" ? match.goalsScored : 0);
        return (
          <MatchCell
            match={match}
            key={idx}
            renderValue={() => cumulativeGoals[team][idx]}
          />
        );
      }),
  ]);
}
