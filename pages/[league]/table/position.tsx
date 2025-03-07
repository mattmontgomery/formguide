import BaseDataPage from "@/components/BaseDataPage";

import { ParentSize } from "@visx/responsive";

import {
  Grid,
  XYChart,
  Axis,
  Tooltip,
  DataContext,
  DataProvider,
} from "@visx/xychart";
import { curveCatmullRom } from "@visx/curve";
import { Box } from "@mui/system";
import { LegendOrdinal } from "@visx/legend";
import React, { useContext, useMemo } from "react";
import { Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { addWeeks, differenceInWeeks, parseISO, startOfWeek } from "date-fns";
import {
  getConferences,
  getConferenceTeams,
  getTable,
  getTeamConference,
} from "@/utils/table";
import { ConferenceDisplayNames } from "@/utils/LeagueConferences";
import { getEarliestMatch, getLatestMatch } from "@/utils/data";
import EasterEggContext from "@/components/Context/EasterEgg";
import { TeamLineSeries, useChartLegend } from "@/components/XYChartTools";

export default function PositionChart() {
  return (
    <BaseDataPage
      pageTitle="League Position over Time"
      renderComponent={(data, meta) => {
        return <LeagueTable data={data} meta={meta} />;
      }}
    />
  );
}

const accessors = {
  // eslint-disable-next-line
  xAccessor: (d: any) => d?.x,
  // eslint-disable-next-line
  yAccessor: (d: any) => d?.y,
};
function LeagueTable({
  data,
  meta,
}: {
  data: Results.ParsedData;
  meta: Results.ParsedMeta;
}): React.ReactElement {
  const easterEgg = useContext(EasterEggContext);
  const conferences = getConferences(meta.league, meta.year);
  const { hoverTeam, selectedTeams, setSelectedTeams, renderComponent } =
    useChartLegend(Object.keys(data.teams));
  const weeklyTables = useMemo<[string, number[]][]>(() => {
    const earliestMatch = getEarliestMatch(data);
    const latestMatch = getLatestMatch(data);
    const first = startOfWeek(parseISO(earliestMatch.rawDate), {
      weekStartsOn: 1,
    });
    const last = addWeeks(startOfWeek(parseISO(latestMatch.rawDate)), 1);
    const weeks = [];
    for (let i = 0; i <= differenceInWeeks(last, first); i++) {
      weeks.push(addWeeks(first, i));
    }
    const weeklyTables = weeks.map((week) => {
      return getTable(data.teams, {
        league: meta.league,
        year: meta.year,
        to: week,
      });
    });

    const weeklyData = Object.keys(data.teams)
      .sort()
      .map((team): [string, number[]] => {
        const teamConference = getTeamConference(team, meta.league, meta.year);

        return [
          team,
          weeklyTables
            .map(({ conferences, table }) => {
              const conferenceIndex = teamConference
                ? conferences.findIndex((c) => c === teamConference)
                : -1;
              if (conferences.length === 1) {
                // find the team in the first week
                return table[0].find((t) => t.team === team);
              } else if (conferenceIndex > -1) {
                return table[conferenceIndex].find((t) => t.team === team);
              }
            })
            .filter(Boolean)
            .map((row) => {
              return row ? row.conferenceRank ?? row.rank ?? -1 : -1;
            }),
        ];
      });

    return weeklyData;
  }, [data, meta.league, meta.year]);
  return (
    <Box>
      {conferences.map((conference, idx) => {
        const conferenceTeams = getConferenceTeams(
          conference,
          meta.league,
          meta.year,
        );
        const allTeams = Object.keys(data.teams);
        const max = conferenceTeams.length || allTeams.length;
        return (
          <Box key={idx}>
            <Typography variant="h5">
              {ConferenceDisplayNames[conference] ?? "All Teams"}
            </Typography>
            <DataProvider
              xScale={{ type: "linear" }}
              yScale={{
                type: "linear",
                domain: easterEgg ? [1, max] : [max, 1],
                zero: false,
                clamp: true,
              }}
            >
              <ParentSize>
                {({ width }) => (
                  <XYChart
                    height={600}
                    width={width}
                    margin={{ top: 30, bottom: 30, left: 20, right: 40 }}
                  >
                    <Grid columns={false} numTicks={max} />
                    {weeklyTables
                      .filter(([team]) => {
                        const teamConference = getTeamConference(
                          team,
                          meta.league,
                          meta.year,
                        );
                        return (
                          (selectedTeams.includes(team) ||
                            selectedTeams.length === 0) &&
                          (teamConference === conference || !teamConference)
                        );
                      })
                      .map(([team, ranks], idx) => (
                        <TeamLineSeries
                          key={idx}
                          curve={curveCatmullRom}
                          dataKey={team}
                          focused={team === hoverTeam}
                          data={ranks.map((rank, idx) => ({
                            x: idx,
                            y: rank,
                          }))}
                          {...accessors}
                        />
                      ))}
                    <Axis orientation="bottom" numTicks={10} />
                    <Axis orientation="right" hideAxisLine numTicks={max} />
                    <Tooltip
                      snapTooltipToDatumX
                      snapTooltipToDatumY
                      showVerticalCrosshair
                      showSeriesGlyphs
                      renderTooltip={({ tooltipData, colorScale }) =>
                        tooltipData &&
                        tooltipData.nearestDatum &&
                        colorScale &&
                        selectedTeams.includes(
                          tooltipData?.nearestDatum?.key,
                        ) ? (
                          <Box>
                            <Box
                              style={{
                                color: colorScale(tooltipData.nearestDatum.key),
                              }}
                            >
                              {tooltipData.nearestDatum.key}
                            </Box>
                            <Box>
                              Week:{" "}
                              {accessors.xAccessor(
                                tooltipData.nearestDatum.datum,
                              )}
                            </Box>
                            <Box>
                              {accessors.yAccessor(
                                tooltipData.nearestDatum.datum,
                              )}{" "}
                              rank
                            </Box>
                          </Box>
                        ) : (
                          <></>
                        )
                      }
                    />
                  </XYChart>
                )}
              </ParentSize>
              {renderComponent(conferenceTeams)}
              <Button
                onClick={() =>
                  setSelectedTeams(
                    selectedTeams.length ? [] : Object.keys(data.teams),
                  )
                }
              >
                {selectedTeams.length ? "Hide" : "Show"} all teams
              </Button>
            </DataProvider>
          </Box>
        );
      })}
    </Box>
  );
}

export function ChartLegend({
  onSelectTeam,
  onHoverTeam,
  selectedTeams = [],
  allTeams = [],
}: {
  onHoverTeam: (team: string | null) => void;
  onSelectTeam: (team: string) => void;
  selectedTeams: string[];
  allTeams: string[];
}): React.ReactElement {
  const { colorScale } = useContext(DataContext);
  return colorScale ? (
    <LegendOrdinal
      direction="column"
      itemMargin="8px 8px 8px 0"
      scale={colorScale}
      labelFormat={(label: string) => label}
      legendLabelProps={{ color: "white" }}
      shape="line"
      style={{
        marginTop: -24,
        display: "flex", // required in addition to `direction` if overriding styles
      }}
    >
      {(labels) => {
        return allTeams.sort().map((team, idx) => {
          const l = labels.find((label) => label.text === team);
          return (
            <React.Fragment key={idx}>
              <FormControlLabel
                onMouseEnter={() => onHoverTeam(team)}
                onMouseLeave={() => onHoverTeam(null)}
                control={
                  <Checkbox
                    checked={selectedTeams.includes(team)}
                    onChange={() => onSelectTeam(team)}
                  />
                }
                label={
                  <Box
                    sx={{
                      borderBottomColor: l ? colorScale(l.text) : "#ddd",
                      borderBottomWidth: 4,
                      borderBottomStyle: "solid",
                    }}
                  >
                    {team}
                  </Box>
                }
              />
            </React.Fragment>
          );
        });
      }}
    </LegendOrdinal>
  ) : (
    <>whoops!</>
  );
}
