import BaseDataPage from "@/components/BaseDataPage";
import League from "@/components/Context/League";
import { Box, Link as MLink } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";

export default function PlayerMinutesBasePage(): React.ReactElement {
  const league = useContext(League);
  return (
    <BaseDataPage
      pageTitle="Game States | Select a team"
      renderComponent={(data) => {
        return Object.keys(data.teams)
          .sort()
          .map((team, idx) => (
            <Box key={idx}>
              <Link passHref href={`/${league}/game-states/team/${team}`}>
                <MLink>{team}</MLink>
              </Link>
            </Box>
          ));
      }}
    ></BaseDataPage>
  );
}
