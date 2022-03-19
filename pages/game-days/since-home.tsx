import MatchCell from "../../components/MatchCell";
import BasePage from "../../components/BaseGridPage";
import { differenceInDays } from "date-fns";

export default function Home(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Days Between Home Games | By Match"
      dataParser={dataParser}
    />
  );
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  return Object.keys(data).map((team) => {
    let lastHome: string;
    return [
      team,
      ...data[team]
        .sort((a, b) => {
          return new Date(a.date) > new Date(b.date) ? 1 : -1;
        })
        .map((match, idx) => {
          if (match.home) {
            lastHome = match.date;
          } else if (idx === 0) {
            lastHome = match.date;
          }
          return (
            <MatchCell
              match={match}
              key={idx}
              prerenderedValue={
                lastHome
                  ? differenceInDays(new Date(match.date), new Date(lastHome))
                  : "-"
              }
            />
          );
        }),
    ];
  });
}
