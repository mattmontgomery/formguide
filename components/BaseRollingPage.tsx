import styles from "@/styles/Home.module.css";
import MatchGrid from "@/components/MatchGrid";
import BaseDataPage, { DataPageProps } from "@/components/BaseDataPage";
import RollingBox from "@/components/Rolling/Box";
import { format } from "util";
import { BasePageProps } from "./BasePage";
import { Box } from "@mui/system";
import { Options, useHomeAway } from "./Toggle/HomeAwayToggle";

export default function BaseRollingPage({
  renderControls,
  pageTitle,
  periodLength,
  parser,
  children,
  getBackgroundColor = () => "success.main",
  getMax,
  max,
  isStaticHeight = true,
  isWide = false,
  getEndpoint,
  heightCalc,
}: React.PropsWithChildren<{
  renderControls?: BasePageProps["renderControls"];
  pageTitle: string;
  periodLength: number;
  parser: Render.RollingParser;
  getBackgroundColor?: Render.GetBackgroundColor;
  getMax?: (data: Results.ParsedData, periodLength: number) => number;
  max?: number;
  isStaticHeight?: boolean;
  isWide?: boolean;
  getEndpoint?: DataPageProps["getEndpoint"];
  heightCalc?: (value: number | null, periodLength: number) => string;
}>): React.ReactElement {
  const { value: homeAway, renderComponent: renderHomeAwayToggle } =
    useHomeAway();
  return (
    <BaseDataPage
      {...(getEndpoint
        ? {
            getEndpoint,
          }
        : {})}
      renderControls={() => (
        <Box sx={{ display: "flex", gap: 2, gridAutoColumns: 2 }}>
          <Box>{renderHomeAwayToggle()}</Box>
          {renderControls && renderControls()}
        </Box>
      )}
      pageTitle={format(pageTitle, periodLength)}
      renderComponent={(data) => {
        const maxValue = max
          ? max
          : typeof getMax === "function"
          ? getMax(data, periodLength)
          : 100;
        return data?.teams ? (
          <MatchGrid
            rowSx={{
              display: "grid",
              gridTemplateColumns: `25px 160px repeat(46, ${
                isWide ? 48 : 32
              }px)`,
            }}
            homeAway={homeAway}
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
                heightCalc: heightCalc
                  ? heightCalc
                  : (value) => {
                      return `${
                        value ? (Math.round(value) / maxValue) * 100 : 0
                      }%`;
                    },
                homeAway,
              })
            }
            showMatchdayHeader={false}
          />
        ) : (
          <></>
        );
      }}
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
  heightCalc,
  homeAway,
}: {
  parser: Render.RollingParser;
  periodLength: number;
  data: Results.ParsedData["teams"];
  getBackgroundColor: Render.GetBackgroundColor;
  isStaticHeight: boolean;
  isWide: boolean;
  heightCalc?: (value: number | null, periodLength: number) => string;
  homeAway: Options;
}): Render.RenderReadyData {
  return parser(data, periodLength, homeAway).map(([team, ...points]) => {
    return [
      team,
      ...points
        .filter((points) => points.value !== null)
        .map((points, idx) => {
          return (
            <RollingBox
              heightCalc={heightCalc}
              isStaticHeight={isStaticHeight}
              getBackgroundColor={getBackgroundColor}
              value={points.value}
              periodLength={periodLength}
              matches={points.matches}
              key={idx}
              {...(isWide
                ? {
                    numberFormat: (value) =>
                      value !== null ? value.toFixed(1) : "",
                  }
                : {})}
            />
          );
        }),
    ];
  });
}
