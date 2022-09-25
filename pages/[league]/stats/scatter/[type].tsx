import React, { useMemo } from "react";

import { useRouter } from "next/router";
import { sortByDate } from "@/utils/sort";
import { getStats, getStatsName, ValidStats } from "@/components/Stats";
import { isComplete } from "@/utils/match";
import { useOpponentToggle } from "@/components/Toggle/OpponentToggle";
import { ParentSize } from "@visx/responsive";
import BaseDataPage from "@/components/BaseDataPage";
import { Axis, DataProvider, GlyphSeries, Grid, XYChart } from "@visx/xychart";

import calculateCorrelation from "calculate-correlation";

export default function StatsByMatch(): React.ReactElement {
  const router = useRouter();
  const types: ValidStats[] = (String(router.query.type).split(
    ","
  ) as ValidStats[]) ?? ["shots", "possession"];
  const { renderComponent, value } = useOpponentToggle();
  return (
    <BaseDataPage<FormGuideAPI.Data.StatsEndpoint>
      renderControls={renderComponent}
      pageTitle={`Statistic scatterplot: ${types
        .map(getStatsName)
        .join(" x ")}`}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      renderComponent={(data) => <DataView data={data} statTypes={types} />}
    ></BaseDataPage>
  );
}
export function DataView({
  data,
  statTypes,
}: {
  data: FormGuideAPI.Data.StatsEndpoint;
  statTypes: ValidStats[];
}): React.ReactElement {
  const correlation = useMemo(() => {
    const x: number[] = [];
    const y: number[] = [];
    Object.entries(data.teams).forEach(([team, matches]) => {
      matches.forEach((match) => {
        const xStat = Number(getStats(match, statTypes[0])[0]);
        const yStat = Number(getStats(match, statTypes[1])[0]);
        if (!Number.isNaN(xStat) && !Number.isNaN(yStat)) {
          x.push(xStat);
          y.push(yStat);
        }
      });
    });
    console.log(x, y);
    return calculateCorrelation(x, y);
  }, [data]);
  return (
    <ParentSize>
      {({ width, height }) => {
        return (
          <DataProvider
            xScale={{ type: "linear" }}
            yScale={{ type: "linear", nice: true }}
          >
            <XYChart width={width} height={600}>
              <Grid columns={false} numTicks={8} />
              <Axis orientation="top" label={`R: ${correlation}`} />
              <Axis orientation="bottom" label={getStatsName(statTypes[0])} />
              <Axis
                orientation="right"
                hideAxisLine
                numTicks={4}
                label={getStatsName(statTypes[1])}
              />
              {Object.entries(data.teams).map(([team, matches], idx) => {
                return (
                  <GlyphSeries
                    key={idx}
                    {...accessors}
                    dataKey={team}
                    data={matches.map((match) => {
                      return {
                        x: getStats(match, statTypes[0])[0],
                        y: getStats(match, statTypes[1])[0],
                      };
                    })}
                  />
                );
              })}
            </XYChart>
          </DataProvider>
        );
        return JSON.stringify(width);
      }}
    </ParentSize>
  );
}

const accessors = {
  xAccessor: (d: any) => d?.x,
  yAccessor: (d: any) => d?.y,
};
