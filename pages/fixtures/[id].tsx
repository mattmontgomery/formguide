import BasePage from "@/components/BasePage";
import { getFormattedDate } from "@/utils/getFormattedValues";
import {
  Box,
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
            <CalendarMonth />
          </ListItemIcon>
          <ListItemText>H2H</ListItemText>
        </ListItem>
        <List sx={{ paddingLeft: 2 }}>
          {predictionData.h2h.map((match, idx) => (
            <ListItem key={idx}>
              <Grid container>
                <Grid item sm={2}>
                  <Box>{getFormattedDate(match.fixture, false)}</Box>
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
