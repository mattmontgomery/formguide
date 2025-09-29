import React from "react";

import BaseDataPage from "@/components/BaseDataPage";
import { useRouter } from "next/router";
import Image from "next/image";
import { Box, Button } from "@mui/material";
import { parseISO } from "date-fns";
import FormattedDate from "@/components/Generic/FormattedDate";
import { getGameStatesExtended } from "@/utils/gameStates";
import Link from "next/link";

export default function GameStates(): React.ReactElement {
  const router = useRouter();
  const team = String(router.query.team);
  return (
    <BaseDataPage<FormGuideAPI.Responses.GoalsEndpoint["data"]>
      pageTitle={`${team} game states`}
      renderTitle={() => (
        <>
          <Box sx={{ display: "inline-block", mr: 2 }}>{team} game states</Box>
          <Link passHref href={router.asPath.replace(/team\/.+/, "/team")}>
            <Button variant="contained">Select a team</Button>
          </Link>
        </>
      )}
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
              rowGap: 2.5,
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
                        <React.Fragment key={idx}>
                          <Box
                            sx={{
                              position: "absolute",
                              left: `calc(${state.minute}% + 12px)`,
                              zIndex: 2,
                              top: -16,
                              fontSize: 12,
                            }}
                          >
                            {state.minute}
                            {"'"}
                          </Box>
                          <Box
                            sx={{
                              color:
                                state.team > state.opponent
                                  ? "success.contrastText"
                                  : state.opponent > state.team
                                    ? "error.contrastText"
                                    : "warning.contrastText",
                              display: "grid",
                              alignContent: "center",
                              position: "absolute",
                              height: "100%",
                              fontWeight: "bold",
                              borderLeft: "4px solid RGBA(0,0,0,0.1)",
                              zIndex: 1,
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
                          >
                            {state.team}-{state.opponent}
                          </Box>
                        </React.Fragment>
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
