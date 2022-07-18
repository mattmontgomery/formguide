import MatchCell from "@/components/MatchCell";
import BasePage from "@/components/BaseGridPage";

export default function GoalDifference(): React.ReactElement {
  return (
    <BasePage pageTitle="GD, single team, 2H - 1H" dataParser={dataParser}>
      <strong>Note:</strong>
      {
        " This is not a super-meaningful chart. It lives mostly as an easy way to see teams that score more goals in the first half than the second half (negative numbers) or the other way around (positive numbers)"
      }
    </BasePage>
  );
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
          renderValue={() =>
            typeof match.firstHalf !== "undefined" &&
            typeof match.secondHalf !== "undefined"
              ? (match.secondHalf?.goalsScored || 0) -
                (match.firstHalf?.goalsScored || 0) -
                (match.firstHalf?.goalsScored || 0)
              : "-"
          }
        />
      )),
  ]);
}
