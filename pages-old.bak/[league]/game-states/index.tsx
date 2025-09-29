import BaseGridPage from "@/components/Grid/Base";
import React, { useState } from "react";

import styles from "@/styles/Home.module.css";
import { FormControlLabel, Switch } from "@mui/material";
import { getExtremeGameState } from "@/utils/gameStates";

export default function GameStates(): React.ReactElement {
  const [show, setShow] = useState<"worst" | "best">("best");
  return (
    <BaseGridPage<Results.MatchWithGoalData>
      renderControls={() => (
        <FormControlLabel
          checked={show === "best"}
          label="Off: Worst, On: Best"
          control={
            <Switch
              onChange={(ev) =>
                setShow(ev.currentTarget.checked ? "best" : "worst")
              }
            />
          }
        />
      )}
      pageTitle={`${show} game states`}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      getValue={(match) => {
        if (!match.goalsData) {
          console.error("Missing", match.fixtureId);
          return "X";
        }
        const extreme = getExtremeGameState(match, show);
        return extreme ? extreme.join("-") : "-";
      }}
      gridClass={styles.gridExtraWide}
    />
  );
}
