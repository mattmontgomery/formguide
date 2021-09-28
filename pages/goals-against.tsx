import MatchCell from "../components/MatchCell";
import BasePage from "../components/BasePage";

export default function Home(): React.ReactElement {
  return (
    <BasePage pageTitle="Goals Against | By Match" dataParser={dataParser} />
  );
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
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
            typeof match.goalsConceded !== "undefined"
              ? match.goalsConceded
              : "-"
          }
        />
      )),
  ]);
}
