import MatchCell from "@/components/MatchCell";
import BasePage from "@/components/BaseGridPage";

export default function GoalsAgainstCumulative(): React.ReactElement {
  return (
    <BasePage pageTitle="Goals Against | Cumulative" dataParser={dataParser} />
  );
}
function dataParser(data: Results.ParsedData["teams"]): Render.RenderReadyData {
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
          (typeof match.goalsConceded === "number" ? match.goalsConceded : 0);
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
