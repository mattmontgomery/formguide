import MatchCell from "../../components/MatchCell";
import BasePage from "../../components/BaseGridPage";
import { differenceInDays } from "date-fns";

export default function Home(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Days Between Games | By Match"
      dataParser={dataParser}
    />
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
            typeof data[team][idx - 1]?.date !== "undefined"
              ? differenceInDays(
                  new Date(data[team][idx].date),
                  new Date(data[team][idx - 1].date)
                )
              : "-"
          }
        />
      )),
  ]);
}
