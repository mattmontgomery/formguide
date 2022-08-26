import React, { useContext } from "react";
import useSWR from "swr";
import LeagueContext from "@/components/LeagueContext";
import fetcher from "@/utils/fetcher";
import BasePage from "@/components/BasePage";
import {
  Box,
  Button,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { SportsSoccerOutlined } from "@mui/icons-material";
import { format, parseISO } from "date-fns";

export default function LeagueOdds(): React.ReactElement {
  const league = useContext(LeagueContext);
  const { data } = useSWR<FormGuideAPI.BaseAPI<TheOdds.Entry[]>>(
    [`/api/theodds/${league}`, league],
    fetcher
  );
  const entries = data?.data ?? [];

  return (
    <BasePage pageTitle={`${league} odds`}>
      <Typography variant="h3">Matches</Typography>
      <ul>
        {entries.map((entry, idx) => {
          const startTime = parseISO(entry.commence_time);
          return (
            <li key={idx}>
              <a href={`#${entry.id}`}>
                {format(startTime, "MM/dd")} {entry.home_team} vs.{" "}
                {entry.away_team}
              </a>
            </li>
          );
        })}
      </ul>
      <List>
        {entries.map((entry, idx) => {
          const startTime = parseISO(entry.commence_time);
          return (
            <>
              <ListItem key={idx} id={entry.id}>
                <ListItemIcon
                  sx={{ alignSelf: "flex-start", paddingTop: ".5rem" }}
                >
                  <SportsSoccerOutlined />
                </ListItemIcon>
                <ListItemText>
                  <Box>
                    <strong>
                      {entry.home_team} vs. {entry.away_team}
                    </strong>
                  </Box>
                  <Box>{startTime.toLocaleDateString()}</Box>
                  <Box>
                    <ul>
                      {entry.bookmakers.map((bookmaker, idx) => {
                        return (
                          <li key={idx}>
                            <strong>{bookmaker.key}</strong>
                            <ul>
                              {bookmaker.markets.map((market, idx) => {
                                return (
                                  <li key={idx}>
                                    {market.key}{" "}
                                    {market.outcomes.map((outcome, idx) => {
                                      return (
                                        <Box key={idx}>
                                          {outcome.name}: {outcome.price}
                                          {outcome.point
                                            ? `, Point: ${outcome.point}`
                                            : ""}
                                        </Box>
                                      );
                                    })}
                                  </li>
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  </Box>
                </ListItemText>
              </ListItem>
              <Divider />
            </>
          );
        })}
      </List>
    </BasePage>
  );
}
