import BaseGridPage from "@/components/Grid/Base";
import React, { useState } from "react";

import styles from "@/styles/Home.module.css";
import { FormControlLabel, Switch } from "@mui/material";
import { getExtremeGameState } from "@/utils/gameStates";
import BaseDataPage from "@/components/BaseDataPage";
import { useRouter } from "next/router";

export default function GameStates(): React.ReactElement {
  const [show, setShow] = useState<"worst" | "best">("best");
  const router = useRouter();
  const team = String(router.query.team);
  return (
    <BaseDataPage<Results.MatchWithGoalData>
      pageTitle={`${team} game states`}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      renderComponent={(data) => {
        return <></>;
      }}
    />
  );
}
