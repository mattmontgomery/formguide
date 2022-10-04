import BaseDataPage from "@/components/BaseDataPage";
import League from "@/components/Context/League";
import { getMultipleGameStateSummary } from "@/utils/gameStates";
import { Box, Link as MLink } from "@mui/material";
import Link from "next/link";
import React, { useContext } from "react";

export default function PlayerMinutesBasePage(): React.ReactElement {
  const league = useContext(League);
  return (
    <BaseDataPage<FormGuideAPI.Responses.GoalsEndpoint["data"]>
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      pageTitle="Game States | Select a team"
      renderComponent={(data) => (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            columnGap: 2,
            rowGap: 1,
          }}
        >
          {Object.entries(data.teams)
            .sort()
            .map(([team, matches], idx) => {
              const states = getMultipleGameStateSummary(matches);
              return (
                <React.Fragment key={idx}>
                  <Box>
                    <Link passHref href={`/${league}/game-states/team/${team}`}>
                      <MLink>{team}</MLink>
                    </Link>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "warning.main",
                      height: 30,
                      position: "relative",
                      display: "grid",
                      alignContent: "center",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "success.main",
                        color: "success.contrastText",
                        position: "absolute",
                        left: 0,
                        pl: 1,
                        width: `${
                          (states.w / (states.w + states.d + states.l)) * 100
                        }%`,
                        height: "100%",
                        display: "grid",
                        alignContent: "center",
                      }}
                    >
                      {Number(
                        (states.w / (states.w + states.d + states.l)) * 100
                      ).toFixed(2)}
                      %
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "warning.main",
                        color: "warning.contrastText",
                        position: "absolute",
                        left: `${
                          (states.w / (states.w + states.d + states.l)) * 100
                        }%`,
                        pl: 1,
                        width: `${
                          (states.d / (states.w + states.d + states.l)) * 100
                        }%`,
                        height: "100%",
                        display: "grid",
                        alignContent: "center",
                      }}
                    >
                      {Number(
                        (states.d / (states.w + states.d + states.l)) * 100
                      ).toFixed(2)}
                      %
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: "error.main",
                        color: "error.contrastText",
                        position: "absolute",
                        pl: 1,
                        right: 0,
                        width: `${
                          (states.l / (states.w + states.d + states.l)) * 100
                        }%`,
                        height: "100%",
                        display: "grid",
                        alignContent: "center",
                      }}
                    >
                      {Number(
                        (states.l / (states.w + states.d + states.l)) * 100
                      ).toFixed(2)}
                      %
                    </Box>
                  </Box>
                </React.Fragment>
              );
            })}
        </Box>
      )}
    ></BaseDataPage>
  );
}
