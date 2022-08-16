import BaseDataPage from "@/components/BaseDataPage";
import getMatchPoints from "@/utils/getMatchPoints";
import { Box } from "@mui/material";
import { curveCatmullRom } from "@visx/curve";
import { DataProvider, Grid, LineSeries, XYChart } from "@visx/xychart";
import { useRouter } from "next/router";

const accessors = {
  xAccessor: (d: any) => d?.x,
  yAccessor: (d: any) => d?.y,
};

function TeamFormByPeriodChart({
  data,
  team,
  periodLength,
}: {
  data: Results.ParsedData;
  meta: Results.ParsedMeta;
  periodLength: number;
  team: string;
}): React.ReactElement {
  console.log(Object.keys(data.teams));
  const lines = data.teams[team]
    .slice(0, data.teams[team].length - periodLength)
    .map((_, idx): [string, number, number[]] => {
      const resultSet = data.teams[team]
        .sort((a, b) => {
          return new Date(a.date) > new Date(b.date) ? 1 : -1;
        })
        .slice(idx, idx + periodLength)
        .filter((match) => match.result !== null);
      return [team, idx, resultSet.map((match) => getMatchPoints(match))];
    })
    .map(([team, seriesIdx, pointSeries], idx) => {
      console.log({ team, pointSeries });
      return (
        <LineSeries
          {...accessors}
          curve={curveCatmullRom}
          dataKey={`${team}:${seriesIdx}`}
          key={idx}
          data={pointSeries.map((p, idx) => ({
            x: seriesIdx + idx,
            y: p,
          }))}
        ></LineSeries>
      );
    });
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
          {lines}
        </XYChart>
      </DataProvider>
    </Box>
  );
}

export default function TeamFormByPeriod() {
  const router = useRouter();
  return (
    <BaseDataPage
      pageTitle="Points over Time"
      renderComponent={(data, meta) => {
        return (
          router.query.period && (
            <TeamFormByPeriodChart
              data={data}
              meta={meta}
              periodLength={Number(router.query.period.toString())}
              team={String(router.query.team)}
            />
          )
        );
      }}
    />
  );
}
