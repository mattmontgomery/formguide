import BaseDataPage from "@/components/BaseDataPage";

import {
  Grid,
  LineSeries,
  XYChart,
  Axis,
  Tooltip,
  DataContext,
  DataProvider,
} from "@visx/xychart";
import { curveCatmullRom } from "@visx/curve";
import { getCumulativeTeamPointsArray } from "@/utils/getTeamPoints";
import { Box } from "@mui/system";
import { LegendOrdinal } from "@visx/legend";
import React, { useContext, useMemo, useState } from "react";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import { setYear, startOfYear } from "date-fns";
import { endOfYear } from "date-fns/esm";
import { sortByDate } from "@/utils/sort";

export default function PointsChart() {
  return (
    <BaseDataPage
      pageTitle="Points over Time"
      renderComponent={(data, meta) => {
        return <LeagueTable data={data} meta={meta} />;
      }}
    />
  );
}
const accessors = {
  xAccessor: (d: any) => d?.x,
  yAccessor: (d: any) => d?.y,
};

function LeagueTable({
  data,
}: {
  data: Results.ParsedData;
  meta: Results.ParsedMeta;
}): React.ReactElement {
  const [selectedTeams, setSelectedTeams] = useState<string[]>(
    Object.keys(data.teams)
  );
  return (
    <Box>
      <DataProvider
        xScale={{ type: "linear" }}
        yScale={{ type: "linear", nice: true }}
      >
        <XYChart
          height={600}
          margin={{ top: 30, bottom: 30, left: 20, right: 40 }}
        >
          <Grid columns={false} numTicks={8} />
          {Object.keys(data.teams)
            .filter((team) => selectedTeams.includes(team))
            .map((team, idx) => (
              <LineSeries
                key={idx}
                {...accessors}
                curve={curveCatmullRom}
                dataKey={team}
                data={getCumulativeTeamPointsArray(data.teams[team]).map(
                  (points, idx) => ({
                    x: idx,
                    y: points,
                  })
                )}
              />
            ))}
          <Axis orientation="bottom" />
          <Axis orientation="right" hideAxisLine numTicks={4} />
          <Tooltip
            snapTooltipToDatumX
            snapTooltipToDatumY
            showVerticalCrosshair
            showSeriesGlyphs
            renderTooltip={({ tooltipData, colorScale }) =>
              tooltipData &&
              tooltipData.nearestDatum &&
              colorScale &&
              selectedTeams.includes(tooltipData?.nearestDatum?.key) ? (
                <div>
                  <Box
                    style={{ color: colorScale(tooltipData.nearestDatum.key) }}
                  >
                    {tooltipData.nearestDatum.key}
                  </Box>
                  <Box>
                    Match day:{" "}
                    {accessors.xAccessor(tooltipData.nearestDatum.datum)}
                  </Box>
                  <Box>
                    {accessors.yAccessor(tooltipData.nearestDatum.datum)} points
                  </Box>
                </div>
              ) : (
                <></>
              )
            }
          />
        </XYChart>
        <ChartLegend
          onSelectTeam={(team) => {
            if (selectedTeams.includes(team)) {
              setSelectedTeams(selectedTeams.filter((t) => t !== team));
            } else {
              setSelectedTeams([...selectedTeams, team]);
            }
          }}
          selectedTeams={selectedTeams}
          allTeams={Object.keys(data.teams)}
        />
        <Button
          onClick={() =>
            setSelectedTeams(
              selectedTeams.length ? [] : Object.keys(data.teams)
            )
          }
        >
          {selectedTeams.length ? "Hide" : "Show"} all teams
        </Button>
      </DataProvider>
    </Box>
  );
}

export function ChartLegend({
  onSelectTeam,
  selectedTeams = [],
  allTeams = [],
}: {
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
