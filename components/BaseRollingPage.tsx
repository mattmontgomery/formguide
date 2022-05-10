import styles from "@/styles/Home.module.css";
import MatchGrid from "@/components/MatchGrid";
import BaseDataPage from "@/components/BaseDataPage";
import RollingBox from "@/components/Rolling/Box";
import { format } from "util";

export default function BaseRollingPage({
  pageTitle,
  periodLength,
  parser,
  children,
  getBackgroundColor = () => "success.main",
  isStaticHeight = true,
  isWide = false,
}: React.PropsWithChildren<{
  pageTitle: string;
  periodLength: number;
  parser: Render.RollingParser;
  getBackgroundColor?: Render.GetBackgroundColor;
  isStaticHeight?: boolean;
  isWide?: boolean;
}>): React.ReactElement {
  return (
    <BaseDataPage
      pageTitle={format(pageTitle, periodLength)}
      renderComponent={(data) =>
        data?.teams ? (
          <MatchGrid
            chartClass={isWide ? styles.chartWide : styles.chart}
            data={data.teams}
            dataParser={(data) =>
              dataParser({
                parser,
                periodLength,
                getBackgroundColor,
                data,
                isStaticHeight,
                isWide,
              })
            }
            showMatchdayHeader={false}
          />
        ) : (
          <></>
        )
      }
    >
      {children}
    </BaseDataPage>
  );
}

function dataParser({
  parser,
  periodLength,
  data,
  getBackgroundColor,
  isStaticHeight,
  isWide,
}: {
  parser: Render.RollingParser;
  periodLength: number;
  data: Results.ParsedData["teams"];
  getBackgroundColor: Render.GetBackgroundColor;
  isStaticHeight: boolean;
  isWide: boolean;
}): Render.RenderReadyData {
  return parser(data, periodLength).map(([team, ...points]) => {
    return [
      team,
      ...points
        .filter((points) => points.value !== null)
        .map((points, idx) => {
          return (
            <RollingBox
              isStaticHeight={isStaticHeight}
              getBackgroundColor={getBackgroundColor}
              value={points.value}
              periodLength={periodLength}
              matches={points.matches}
              key={idx}
              {...(isWide
                ? {
                    numberFormat: (value) => (value ? value.toFixed(1) : ""),
                  }
                : {})}
            />
          );
        }),
    ];
  });
}
