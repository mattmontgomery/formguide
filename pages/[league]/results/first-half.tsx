import BasePage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";

export default function GoalsFor(): React.ReactElement {
  return (
    <BasePage pageTitle="Halftime Results | By Match" dataParser={dataParser} />
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
        <MatchCell match={match} key={idx} resultType="first-half" />
      )),
  ]);
}
