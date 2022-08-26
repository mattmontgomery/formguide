import styles from "@/styles/Home.module.css";
import MatchCell from "@/components/MatchCell";
import getTeamPoints from "@/utils/getTeamPoints";
import BasePage from "@/components/BaseGridPage";
import { getArrayAverage, getArraySum } from "@/utils/array";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";

export default function PPGOutcomes(): React.ReactElement {
  const [newProjection, setNewProjection] = useState<boolean>(true);
  const [periodLength, setPeriodLength] = useState<number>(8);
  return (
    <BasePage
      dataParser={(data) => dataParser(data, newProjection, periodLength)}
      pageTitle="Projected Points based on home/away ppg"
      gridClass={styles.gridExtraWide}
    >
      <Box>
        Calculation: Match result for finished matches, summed with the PPG for
        home/away. Gets more accurate through the season.
      </Box>
      <Box>
        New projection method: Only takes PPG for finished games into
        consideration, not projected games
      </Box>
      <Box>
        <FormControlLabel
          label="Use new projection method"
          control={
            <Switch
              checked={newProjection}
              onChange={(ev) => setNewProjection(ev.currentTarget.checked)}
            />
          }
        />
      </Box>
      <Box>
        Rolling Length{" "}
        <ToggleButtonGroup
          color="primary"
          value={periodLength}
          exclusive
          onChange={(_, value) => setPeriodLength(value)}
        >
          <ToggleButton value={0}>All matches</ToggleButton>
          <ToggleButton value={3}>3-game</ToggleButton>
          <ToggleButton value={5}>5 -game</ToggleButton>
          <ToggleButton value={8}>8-game</ToggleButton>
          <ToggleButton value={11}>11-game</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </BasePage>
  );
}
function dataParser(
  data: Results.ParsedData["teams"],
  newProjection = true,
  periodLength = 0
): Render.RenderReadyData {
  const teamPoints = getTeamPoints(data);
  const teamCumulativeProjectedPoints: Record<string, number[]> = {};
  Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => {
        if (!teamCumulativeProjectedPoints[team]) {
          teamCumulativeProjectedPoints[team] = [];
        }
        teamCumulativeProjectedPoints[team][idx] = match.result
          ? getArraySum(
              teamPoints[team]
                .filter((_, arraySumIdx) => arraySumIdx <= idx)
                .map((p) => p.points)
            )
          : teamCumulativeProjectedPoints[team][idx - 1] +
            (match.home
              ? getArrayAverage(
                  teamPoints[team]
                    .filter((m) => m.date < new Date(match.date) && m.home)
                    .filter((m) => (newProjection ? !!m.result : true))
                    .map((p) => p.points)
                    .reverse()
                    .slice(
                      0,
                      periodLength > 0 ? periodLength : teamPoints[team].length
                    )
                )
              : getArrayAverage(
                  teamPoints[team]
                    .filter((m) => m.date < new Date(match.date) && !m.home)
                    .filter((m) => (newProjection ? !!m.result : true))
                    .map((p) => p.points)
                    .reverse()
                    .slice(
                      0,
                      periodLength > 0 ? periodLength : teamPoints[team].length
                    )
                ));
      }),
  ]);
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
            match && match.result
              ? teamCumulativeProjectedPoints[team][idx]
              : teamCumulativeProjectedPoints[team][idx].toFixed(2)
          }
        />
      )),
  ]);
}
