import React, { useCallback, useContext, useState } from "react";
import useSWR from "swr";
import LeagueContext from "@/components/LeagueContext";
import fetcher from "@/utils/fetcher";
import BasePage from "@/components/BasePage";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { SportsSoccerOutlined } from "@mui/icons-material";
import { format, parseISO } from "date-fns";

export default function LeagueOdds(): React.ReactElement {
  const league = useContext(LeagueContext);
  const { data } = useSWR<FormGuideAPI.BaseAPIV2<TheOdds.Entry[]>>(
    [`/api/theodds/${league}`, league],
    fetcher
  );
  const entries = data?.data ?? [];

  const [oddsFormat, setOddsFormat] = useState<"decimal" | "american">(
    "american"
  );

  const oddsFormatter = useCallback(
    (odds: number): number | string => {
      switch (oddsFormat) {
        case "american":
          const _odds = Math.round(
            odds >= 2 ? (odds - 1) * 100 : -100 / (odds - 1)
          );
          return _odds > 0 ? `+${_odds}` : _odds;
        case "decimal":
          return odds;
      }
    },
    [oddsFormat]
  );

  return (
    <BasePage pageTitle={`${league} odds`}>
      <ButtonGroup>
        <Button
          onClick={() => setOddsFormat("american")}
          variant={oddsFormat === "american" ? "contained" : "outlined"}
        >
          American
        </Button>
        <Button
          onClick={() => setOddsFormat("decimal")}
          variant={oddsFormat === "decimal" ? "contained" : "outlined"}
        >
          Decimal
        </Button>
      </ButtonGroup>
      <ul>
        {entries.map((entry, idx) => {
          const startTime = parseISO(entry.commence_time);
          return (
            <li key={idx}>
              <Link href={`#${entry.id}`}>
                {format(startTime, "MM/dd")} {entry.home_team} vs.{" "}
                {entry.away_team}
              </Link>
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
                                          {outcome.name}:{" "}
                                          {oddsFormatter(outcome.price)}
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
