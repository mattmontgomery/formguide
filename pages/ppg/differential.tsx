import styles from "../../styles/Home.module.css";
import MatchCell from "../../components/MatchCell";
import getTeamPoints from "../../utils/getTeamPoints";
import BasePage from "../../components/BaseGridPage";
import { getArrayAverage } from "../../utils/array";

export default function PPGOutcomes(): React.ReactElement {
  return (
    <BasePage
      dataParser={dataParser}
      pageTitle="PPG Differential"
      gridClass={styles.gridExtraWide}
    >
      {"Opponent PPG - Team PPG (positive — beat team with greater ppg)"}
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
            const points = getArrayAverage(
              teamPoints[match.opponent]
                .filter(
                  (opponentMatch) => opponentMatch.date < new Date(match.date)
                )
                .map((opponentPoints) => opponentPoints.points)
            );
            const ownPoints = getArrayAverage(
              teamPoints[match.team]
                .filter(
                  (opponentMatch) => opponentMatch.date < new Date(match.date)
                )
                .map((opponentPoints) => opponentPoints.points)
            );
            if (!match.result) {
              return "-";
            } else {
              return (points - ownPoints).toFixed(2);
            }
          }}
        />
      )),
  ]);
}
