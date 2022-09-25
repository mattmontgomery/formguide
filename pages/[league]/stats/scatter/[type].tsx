import React, { useMemo } from "react";

import { useRouter } from "next/router";
import { getStats, getStatsName, ValidStats } from "@/components/Stats";
import { ParentSize } from "@visx/responsive";
import BaseDataPage from "@/components/BaseDataPage";
import { Axis, DataProvider, GlyphSeries, Grid, XYChart } from "@visx/xychart";

import calculateCorrelation from "calculate-correlation";
import { useStatsToggle } from "@/components/Selector/Stats";

export default function StatsByMatch(): React.ReactElement {
  const router = useRouter();
  const types: ValidStats[] = (String(router.query.type).split(
    ","
  ) as ValidStats[]) ?? ["shots", "possession"];

  const { renderComponent: renderStatsToggle, value: statTypes } =
    useStatsToggle({ selected: types });
  return (
    <BaseDataPage<FormGuideAPI.Data.StatsEndpoint>
      renderControls={renderStatsToggle}
      pageTitle={`Statistic scatterplot: ${statTypes
        .map(getStatsName)
        .join(" x ")}`}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      renderComponent={(data) => <DataView data={data} statTypes={statTypes} />}
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
  const statTypesValidated = [null, null].map((_, idx) => {
    return statTypes[idx] ?? "goals";
  });
  const correlation = useMemo(() => {
    const x: number[] = [];
    const y: number[] = [];
    Object.entries(data.teams).forEach(([, matches]) => {
      matches.forEach((match) => {
        console.log(getStats(match, statTypesValidated[0]));
        const xStat = Number(getStats(match, statTypesValidated[0] ?? 0)[0]);
        const yStat = Number(getStats(match, statTypesValidated[1] ?? 0)[0]);
        if (!Number.isNaN(xStat) && !Number.isNaN(yStat)) {
          x.push(xStat);
          y.push(yStat);
        }
      });
    });
    return calculateCorrelation(x, y);
  }, [data, statTypesValidated]);
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
                        x: getStats(match, statTypes[0])[0] ?? 0,
                        y: getStats(match, statTypes[1])[0] ?? 0,
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
