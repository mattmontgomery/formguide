import MatchCell from "../components/MatchCell";
import BasePage from "../components/BaseGridPage";

export default function Home(): React.ReactElement {
  return <BasePage dataParser={dataParser} pageTitle="" />;
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))
      .map((match, idx) => <MatchCell match={match} key={idx} />),
  ]);
}
