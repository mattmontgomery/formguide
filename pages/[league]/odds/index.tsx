import React, { useCallback, useContext, useState } from "react";
import useSWR from "swr";
import LeagueContext from "@/components/Context/League";
import fetcher from "@/utils/fetcher";
import BasePage from "@/components/BasePage";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format, formatRelative, parseISO } from "date-fns";
import { LeagueOptions } from "@/utils/Leagues";

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

  return (
    <BasePage pageTitle={`${LeagueOptions[league]} odds`}>
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
      <Box sx={{ py: 2, fontSize: 14 }}>
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
      </Box>
      <Divider />
      {entries.map((entry, idx) => {
        const startTime = parseISO(entry.commence_time);
        return (
          <Box key={idx} p={2}>
            <Typography variant="overline">
              {startTime.toLocaleDateString()}
            </Typography>
            <Typography id={entry.id} variant="h4">
              <strong>
                {entry.home_team} vs. {entry.away_team}
              </strong>
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bookmaker</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>{entry.home_team}</TableCell>
                  <TableCell>{entry.away_team}</TableCell>
                  <TableCell>Draw</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entry.bookmakers.map((bookmaker, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <TableRow key={idx}>
                        <TableCell rowSpan={bookmaker.markets.length}>
                          {bookmaker.title}
                        </TableCell>
                        <TableCell rowSpan={bookmaker.markets.length}>
                          {formatRelative(
                            parseISO(bookmaker.last_update),
                            new Date()
                          )}
                        </TableCell>
                        <TableCell>{bookmaker.markets[0].key}</TableCell>
                        <TableCell>
                          <Outcome
                            oddsFormat={oddsFormat}
                            outcome={bookmaker.markets[0].outcomes.find(
                              (o) => o.name === entry.home_team
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Outcome
                            oddsFormat={oddsFormat}
                            outcome={bookmaker.markets[0].outcomes.find(
                              (o) => o.name === entry.away_team
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Outcome
                            oddsFormat={oddsFormat}
                            outcome={bookmaker.markets[0].outcomes.find(
                              (o) => o.name === "Draw"
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      {bookmaker.markets.slice(1).map((market, idx) => {
                        return (
                          <TableRow key={idx}>
                            <TableCell>{market.key}</TableCell>
                            <TableCell>
                              <Outcome
                                oddsFormat={oddsFormat}
                                outcome={market.outcomes.find((o) =>
                                  market.key === "totals"
                                    ? o.name === "Over"
                                    : o.name === entry.home_team
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Outcome
                                oddsFormat={oddsFormat}
                                outcome={market.outcomes.find((o) =>
                                  market.key === "totals"
                                    ? o.name === "Under"
                                    : o.name === entry.away_team
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Outcome
                                oddsFormat={oddsFormat}
                                outcome={market.outcomes.find(
                                  (o) => o.name === "Draw"
                                )}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            <Divider />
          </Box>
        );
      })}
    </BasePage>
  );
}

function Outcome(props: {
  outcome?: { name: string; price: number; point?: number };
  oddsFormat: "decimal" | "american";
}): React.ReactElement {
  const oddsFormatter = useCallback(
    (odds: number): number | string => {
      switch (props.oddsFormat) {
        case "american":
          const _odds = Math.round(
            odds >= 2 ? (odds - 1) * 100 : -100 / (odds - 1)
          );
          return _odds > 0 ? `+${_odds}` : _odds;
        case "decimal":
          return odds;
      }
    },
    [props.oddsFormat]
  );
  return (
    <>
      {(props.outcome?.name === "Over" || props.outcome?.name === "Under") && (
        <strong>{props.outcome?.name}: </strong>
      )}
      {props.outcome?.price && oddsFormatter(props.outcome?.price)}{" "}
      {props.outcome?.point ? `, Point: ${props.outcome.point}` : ""}
    </>
  );
}
