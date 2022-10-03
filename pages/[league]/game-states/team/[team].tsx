import React, { useState } from "react";

import BaseDataPage from "@/components/BaseDataPage";
import { useRouter } from "next/router";
import Image from "next/image";
import { Box } from "@mui/material";
import { parseISO } from "date-fns";
import FormattedDate from "@/components/Generic/FormattedDate";
import { getGameStates, getGameStatesExtended } from "@/utils/gameStates";

export default function GameStates(): React.ReactElement {
  const [show, setShow] = useState<"worst" | "best">("best");
  const router = useRouter();
  const team = String(router.query.team);
  return (
    <BaseDataPage<FormGuideAPI.Responses.GoalsEndpoint["data"]>
      pageTitle={`${team} game states`}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      renderComponent={(data) => {
        const matches = data.teams[team] ?? [];
        return (
          <Box
            p={2}
            sx={{
              display: "grid",
              gridTemplateColumns: "auto auto 1fr",
              columnGap: 2,
              rowGap: 1,
              alignItems: "center",
            }}
          >
            {matches.map((match, idx) => {
              return (
                <React.Fragment key={idx}>
                  <Box sx={{ textAlign: "right" }}>
                    <FormattedDate date={parseISO(match.rawDate)} />
                  </Box>
                  <Image
                    src={match.opponentLogo}
                    width={40}
                    height={40}
                    alt={match.opponent}
                  />
                  <Box
                    sx={{
                      backgroundColor: "warning.main",
                      position: "relative",
                      height: "100%",
                      display: "grid",
                      alignItems: "center",
                    }}
                  >
                    {getGameStatesExtended(match).map((state, idx) => {
                      return (
                        <Box
                          sx={{
                            display: "grid",
                            alignContent: "center",
                            position: "absolute",
                            height: "100%",
                            fontWeight: "bold",
                            pl: 1,
                            left: `${state.minute}%`,
                            right: 0,
                            backgroundColor:
                              state.team > state.opponent
                                ? "success.main"
                                : state.opponent > state.team
                                ? "error.main"
                                : "warning.main",
                          }}
                          key={idx}
                        >
                          {state.team}-{state.opponent}
                        </Box>
                      );
                    })}
                  </Box>
                </React.Fragment>
              );
            })}
          </Box>
        );
      }}
    />
  );
}
