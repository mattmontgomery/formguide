import MatchCell from "../../components/MatchCell";
import getTeamPoints from "../../utils/getTeamPoints";
import BasePage from "../../components/BasePage";

export default function PPGOutcomes(): React.ReactElement {
  return (
    <BasePage dataParser={dataParser} pageTitle="Outcomes">
      <h3>Key</h3>
      <ul>
        <li>++: Beat team with greater PPG</li>
        <li>+: Beat team with lesser PPG</li>
        <li>{"//: Drew team with greater PPG"}</li>
        <li>{"/: Drew team with lesser PPG"}</li>
        <li>-: Lost to team with greater PPG</li>
        <li>--: Lost to team with lesser PPG</li>
      </ul>
    </BasePage>
  );
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  const teamPoints = getTeamPoints(data);
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
          renderValue={(match) => {
            const points = getArraySum(
              teamPoints[match.opponent]
                .filter(
                  (opponentMatch) => opponentMatch.date < new Date(match.date)
                )
                .map((opponentPoints) => opponentPoints.points)
            );
            const ownPoints = getArraySum(
              teamPoints[match.team]
                .filter(
                  (opponentMatch) => opponentMatch.date < new Date(match.date)
                )
                .map((opponentPoints) => opponentPoints.points)
            );
            if (!match.result) {
              return "-";
            } else if (match.result === "W") {
              return points > ownPoints ? "++" : "+";
            } else if (match.result === "L") {
              return points > ownPoints ? "-" : "--";
            } else {
              return points > ownPoints ? "//" : "/";
            }
          }}
        />
      )),
  ]);
}

function getArraySum(values: number[]): number {
  return values.length ? values.reduce((sum, curr) => sum + curr, 0) : 0;
}
