import BasePage from "@/components/BasePage";
import Link from "next/link";
import {
  getFormattedDate,
  getFormattedEventName,
} from "@/utils/getFormattedValues";
import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import {
  AutoGraph,
  CalendarMonth,
  FormatShapes,
  SportsSoccerTwoTone,
  Timeline,
} from "@mui/icons-material";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Fixture(): React.ReactElement {
  const router = useRouter();
  const { id } = router.query;
  const resp = useSWR<{
    errors: string[];
    data: {
      fixtureData: Results.FixtureApi[];
      predictionData: Results.PredictionApi[];
    };
  }>(`/api/fixture/${id}`, fetcher);
  const data = resp?.data;
  const fixtureData: Results.FixtureApi | null =
    data?.data?.fixtureData?.[0] || null;
  const predictionData: Results.PredictionApi | null =
    data?.data?.predictionData?.[0] || null;
  return !fixtureData || !predictionData ? (
    <BasePage pageTitle="">
      {(data?.errors?.length || 0) > 0 ? "Could not load data" : null}
    </BasePage>
  ) : (
    <BasePage
      pageTitle={`${fixtureData?.teams.home.name} vs. ${fixtureData?.teams.away.name}`}
    >
      <List>
        <ListItem>
          <ListItemText>
            <strong>Date</strong>:{" "}
            {fixtureData?.fixture
              ? getFormattedDate(fixtureData.fixture)
              : null}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>Referee</strong>: {fixtureData?.fixture.referee || "TBA"}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>Over/Under</strong>: {predictionData.predictions.under_over}
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>API-FOOTBALL advice</strong>:{" "}
            {predictionData.predictions.advice}
          </ListItemText>
        </ListItem>
        <Divider />
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemIcon>
            <SportsSoccerTwoTone />
          </ListItemIcon>
          <ListItemText>Events</ListItemText>
        </ListItem>
        <Box sx={{ padding: 2 }}>
          <Grid container>
            {fixtureData?.events.map((event, idx) => (
              <Grid container key={idx}>
                <Grid
                  item
                  xs={0}
                  sm={1}
                  sx={{ textAlign: { sm: "right" }, paddingRight: 1 }}
                >
                  {event.time.elapsed}
                  {"'"}
                </Grid>
                <Grid item xs={5} sm={1}>
                  {event.team.name}
                </Grid>
                <Grid item xs={6} sm={1}>
                  <strong>{getFormattedEventName(event)}</strong>
                </Grid>
                <Grid item xs={12} sm={3}>
                  {event.type === "subst" ? "Off: " : ""}
                  {event.player.name}
                </Grid>
                <Grid item xs={12} sm={3}>
                  {event.type === "Goal"
                    ? `Assist: ${event.assist?.name || "N/A"}`
                    : ""}
                </Grid>
                <Grid
                  item
                  xs={12}
                  paddingY={2}
                  sx={{ display: { sm: "none" } }}
                >
                  <Divider />
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Divider />
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemIcon>
            <SportsSoccerTwoTone />
          </ListItemIcon>
          <ListItemText>Lineup</ListItemText>
        </ListItem>
        <Box sx={{ padding: 2, maxWidth: 800 }}>
          <Grid container>
            {fixtureData?.lineups.map((lineup, idx) => (
              <Grid container key={idx} sx={{ paddingBottom: 2 }}>
                <Grid item xs={12} sm={2}>
                  <strong>{lineup.team.name}</strong>
                </Grid>
                <Grid item xs={6} sm={5}>
                  <Box sx={{ paddingBottom: 1 }}>
                    <strong>Starting XI</strong>
                  </Box>
                  {lineup.startXI.map((p, idx) => (
                    <Box key={idx}>
                      {p.player.name} ({p.player.pos})
                    </Box>
                  ))}
                </Grid>
                <Grid item xs={6} sm={5}>
                  <Box sx={{ paddingBottom: 1 }}>
                    <strong>Substitutes</strong>
                  </Box>
                  {lineup.substitutes.map((p, idx) => (
                    <Box key={idx}>
                      {p.player.name} ({p.player.pos})
                    </Box>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Divider />
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemIcon>
            <AutoGraph />
          </ListItemIcon>
          <ListItemText>Predictions</ListItemText>
        </ListItem>
        <List sx={{ paddingLeft: 2 }}>
          <ListItem>
            <ListItemText>
              <strong>Home win %</strong>:{" "}
              {predictionData.predictions.percent.home}
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <strong>Draw %</strong>: {predictionData.predictions.percent.draw}
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <strong>Away win %</strong>:{" "}
              {predictionData.predictions.percent.away}
            </ListItemText>
          </ListItem>
        </List>
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemIcon>
            <CalendarMonth
              sx={{ cursor: "pointer" }}
              onClick={() => {
                const last10 = predictionData.h2h
                  .map(
                    (match) =>
                      `<li>${getFormattedDate(match.fixture, false)}: ${
                        match.teams.home.winner
                          ? `<strong>${match.teams.home.name}</strong>`
                          : match.teams.home.name
                      } ${match.score.fulltime.home}-${
                        match.score.fulltime.away
                      } ${
                        match.teams.away.winner
                          ? `<strong>${match.teams.away.name}</strong>`
                          : match.teams.away.name
                      }</i>`
                  )
                  .join(`\n`);
                const htmlBlob = new Blob([`<ul>${last10}</ul>`], {
                  type: "text/html",
                });
                const plainTextBlob = new Blob(
                  [
                    predictionData.h2h
                      .map(
                        (match) =>
                          `- ${getFormattedDate(match.fixture, false)}: ${
                            match.teams.home.winner
                              ? `*${match.teams.home.name}*`
                              : match.teams.home.name
                          } ${match.score.fulltime.home}-${
                            match.score.fulltime.away
                          } ${
                            match.teams.away.winner
                              ? `*${match.teams.away.name}*`
                              : match.teams.away.name
                          }`
                      )
                      .join(`\n`),
                  ],
                  {
                    type: "text/plain",
                  }
                );
                const clipped = new ClipboardItem({
                  [htmlBlob.type]: htmlBlob,
                  [plainTextBlob.type]: plainTextBlob,
                });
                navigator.clipboard.write([clipped]);
              }}
            />
          </ListItemIcon>
          <ListItemText>H2H</ListItemText>
        </ListItem>
        <List sx={{ paddingLeft: 2 }}>
          {predictionData.h2h.map((match, idx) => (
            <ListItem key={idx}>
              <Grid container>
                <Grid item sm={2}>
                  <Link href={`/fixtures/${match.fixture.id}`} passHref>
                    <Button>{getFormattedDate(match.fixture, false)}</Button>
                  </Link>
                </Grid>
                <Grid item sm={2}>
                  <Box
                    sx={{
                      color: match.teams.home.winner ? "success.main" : "",
                    }}
                  >
                    {match.teams.home.name}
                  </Box>
                </Grid>
                <Grid item sm={1}>
                  {match.score.fulltime.home}-{match.score.fulltime.away}
                </Grid>
                <Grid item sm={2}>
                  <Box
                    sx={{
                      color: match.teams.away.winner ? "success.main" : "",
                    }}
                  >
                    {match.teams.away.name}
                  </Box>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>Timeline / Goals For</ListItemText>
        </ListItem>
        <List sx={{ paddingLeft: 2 }}>
          <ListItem>
            <ListItemText>
              <Grid container>
                <Grid item sm={1}>
                  Time segment
                </Grid>
                <Grid item sm={2}>
                  {fixtureData.teams.home.name}
                </Grid>
                <Grid item sm={2}>
                  {fixtureData.teams.away.name}
                </Grid>
              </Grid>
            </ListItemText>
          </ListItem>
          {Object.keys(predictionData.teams.home.league.goals.for.minute).map(
            (segment, idx) => (
              <ListItem key={idx}>
                <ListItemText>
                  <Grid container>
                    <Grid item sm={1}>
                      {segment}
                    </Grid>
                    <Grid item sm={2}>
                      {
                        predictionData.teams.home.league.goals.for.minute[
                          segment
                        ].total
                      }
                    </Grid>
                    <Grid item sm={2}>
                      {
                        predictionData.teams.away.league.goals.for.minute[
                          segment
                        ].total
                      }
                    </Grid>
                  </Grid>
                </ListItemText>
              </ListItem>
            )
          )}
        </List>
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>Timeline / Goals Against</ListItemText>
        </ListItem>
        <List sx={{ paddingLeft: 2 }}>
          <ListItem>
            <ListItemText>
              <Grid container>
                <Grid item sm={1}>
                  Time segment
                </Grid>
                <Grid item sm={2}>
                  {fixtureData.teams.home.name}
                </Grid>
                <Grid item sm={2}>
                  {fixtureData.teams.away.name}
                </Grid>
              </Grid>
            </ListItemText>
          </ListItem>
          {Object.keys(
            predictionData.teams.home.league.goals.against.minute
          ).map((segment, idx) => (
            <ListItem key={idx}>
              <ListItemText>
                <Grid container>
                  <Grid item sm={1}>
                    {segment}
                  </Grid>
                  <Grid item sm={2}>
                    {
                      predictionData.teams.home.league.goals.against.minute[
                        segment
                      ].total
                    }
                  </Grid>
                  <Grid item sm={2}>
                    {
                      predictionData.teams.away.league.goals.against.minute[
                        segment
                      ].total
                    }
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemIcon>
            <FormatShapes />
          </ListItemIcon>
          <ListItemText>{fixtureData.teams.home.name} formations</ListItemText>
        </ListItem>
        <List sx={{ paddingLeft: 2 }}>
          {predictionData.teams.home.league.lineups.map((l, idx) => (
            <ListItem key={idx}>
              <ListItemText>
                <Grid container>
                  <Grid item sm={1}>
                    {l.formation}
                  </Grid>
                  <Grid item sm={2}>
                    {l.played}
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <ListItem sx={{ paddingBottom: 0 }}>
          <ListItemIcon>
            <FormatShapes />
          </ListItemIcon>
          <ListItemText>{fixtureData.teams.away.name} formations</ListItemText>
        </ListItem>
        <List sx={{ paddingLeft: 2 }}>
          {predictionData.teams.away.league.lineups.map((l, idx) => (
            <ListItem key={idx}>
              <ListItemText>
                <Grid container>
                  <Grid item sm={1}>
                    {l.formation}
                  </Grid>
                  <Grid item sm={2}>
                    {l.played}
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </List>
    </BasePage>
  );
}
