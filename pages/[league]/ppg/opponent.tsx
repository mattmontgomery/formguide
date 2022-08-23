import styles from "@/styles/Home.module.css";
import MatchCell from "@/components/MatchCell";
import getTeamPoints from "@/utils/getTeamPoints";
import BaseGridPage from "@/components/BaseGridPage";
import { getArrayAverageFormatted } from "@/utils/array";
import { useState } from "react";
import { FormControlLabel, FormLabel, Switch } from "@mui/material";

export default function PPGOpponent(): React.ReactElement {
  const [useHomeAway, setUseHomeAway] = useState<boolean>(true);
  return (
    <BaseGridPage
      dataParser={(data) => dataParser(data, useHomeAway)}
      pageTitle="Opponent PPG before given match"
      gridClass={styles.gridWide}
    >
      <FormControlLabel
        label="Use Home/Away PPG"
        control={
          <Switch onChange={(ev) => setUseHomeAway(ev.currentTarget.checked)} />
        }
      ></FormControlLabel>
    </BaseGridPage>
  );
}
function dataParser(
  data: Results.ParsedData["teams"],
  useHomeAway = true
): Render.RenderReadyData {
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
          renderValue={() => {
            const points = teamPoints[match.opponent]
              .filter(
                (opponentMatch) =>
                  opponentMatch.date < new Date(match.date) &&
                  opponentMatch.result !== null
              )
              .filter((opponentMatch) => {
                if (useHomeAway) {
                  return opponentMatch.home === !match.home;
                }
                return true;
              })
              .map((opponentPoints) => opponentPoints.points);
            return getArrayAverageFormatted(points);
          }}
        />
      )),
  ]);
}
