import styles from "@/styles/Home.module.css";
import BaseDataPage, { DataPageProps } from "@/components/BaseDataPage";
import { format } from "util";
import { BasePageProps } from "./BasePage";
import { Box } from "@mui/system";
import { Options, useHomeAway } from "./Toggle/HomeAwayToggle";
import { getArrayAverage } from "@/utils/array";
import React from "react";
import MatchGridV2 from "./MatchGridV2";
import { PeriodLengthOptions, usePeriodLength } from "./Toggle/PeriodLength";
import { useRouter } from "next/router";
import RollingBoxV2, { NumberFormat } from "./Rolling/BoxV2";

export type BaseRollingPageProps<T> = {
  pageTitle: string;
  getBackgroundColor?: (args: {
    periodLength: number;
    value: number | null;
  }) => string;
  getMax?: (periodLength: number) => number;
  getSummaryValue?: (values: number[]) => number;
  getValue: (match: T) => number | undefined;
  getEndpoint?: DataPageProps["getEndpoint"];
  heightCalc?: (value: number | null, periodLength: number) => string;
  isStaticHeight?: boolean;
  isWide?: boolean;
  numberFormat?: NumberFormat;
  max?: number;
  renderControls?: BasePageProps["renderControls"];
};

export default function BaseRollingPageV2<T extends Results.Match>({
  children,
  getBackgroundColor = () => "success.light",
  getEndpoint,
  getMax,
  getSummaryValue,
  getValue,
  heightCalc,
  isStaticHeight = true,
  isWide = false,
  max = 100,
  numberFormat,
  pageTitle,
  renderControls,
}: React.PropsWithChildren<BaseRollingPageProps<T>>): React.ReactElement {
  const router = useRouter();
  const { value: homeAway, renderComponent: renderHomeAwayToggle } =
    useHomeAway();
  const { period = 5 } = router.query;
  const defaultPeriodLength: PeriodLengthOptions =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const { value: periodLength, renderComponent: renderPeriodLength } =
    usePeriodLength(defaultPeriodLength);
  const trueMax = typeof getMax === "function" ? getMax(periodLength) : max;
  return (
    <BaseDataPage<{ teams: Record<string, T[]> }>
      {...(getEndpoint
        ? {
            getEndpoint,
          }
        : {})}
      renderControls={() => (
        <Box sx={{ display: "flex", gap: 2, gridAutoColumns: 2 }}>
          {renderHomeAwayToggle()}
          {renderPeriodLength()}
          {renderControls && renderControls()}
        </Box>
      )}
      pageTitle={format(pageTitle, periodLength)}
      renderComponent={(data) => {
        return data?.teams ? (
          <MatchGridV2<T>
            rowSx={{
              display: "grid",
              gridTemplateColumns: `25px 160px repeat(46, ${
                isWide ? 48 : 36
              }px)`,
            }}
            homeAway={homeAway}
            chartClass={isWide ? styles.chartWide : styles.chart}
            data={data.teams}
            dataParser={(data) =>
              dataParser<T>({
                periodLength,
                getBackgroundColor,
                getSummaryValue,
                getValue,
                data,
                isStaticHeight,
                isWide,
                heightCalc: heightCalc
                  ? heightCalc
                  : (value) => {
                      return `${
                        value ? (Math.round(value) / trueMax) * 100 : 0
                      }%`;
                    },
                homeAway,
                numberFormat,
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

function dataParser<T extends Results.Match>({
  periodLength,
  data,
  getBackgroundColor,
  getSummaryValue = getArrayAverage,
  getValue,
  isStaticHeight,
  isWide,
  heightCalc,
  homeAway,
  numberFormat,
}: {
  periodLength: number;
  data: Record<string, T[]>;
  getBackgroundColor: BaseRollingPageProps<T>["getBackgroundColor"];
  getSummaryValue: BaseRollingPageProps<T>["getSummaryValue"];
  getValue: BaseRollingPageProps<T>["getValue"];
  isStaticHeight: boolean;
  isWide: boolean;
  heightCalc?: (value: number | null, periodLength: number) => string;
  homeAway: Options;
  numberFormat?: NumberFormat;
}): [string, ...React.ReactElement[]][] {
  const parsedData = Object.keys(data)
    .sort()
    .map((team) => {
      return [
        team,
        ...data[team]
          .slice(0, data[team].length - periodLength)
          .map((_, idx) => {
            const resultSet = data[team]
              .sort((a, b) => {
                return new Date(a.date) > new Date(b.date) ? 1 : -1;
              })
              .filter((m) =>
                homeAway === "all" ? true : m.home === (homeAway === "home")
              )
              .slice(idx, idx + periodLength)
              .filter((match) => match.result !== null);
            const valueSet = resultSet.map(getValue);
            return {
              value:
                valueSet.length !== periodLength
                  ? null
                  : getSummaryValue(
                      valueSet.filter(
                        (n) => typeof n === "number" && Number(n)
                      ) as number[]
                    ),
              matches: resultSet,
            };
          }),
      ];
    });
  return parsedData.map(
    ([team, ...values]): [string, ...React.ReactElement[]] => {
      return [
        String(team),
        ...values
          .filter((item) => typeof item !== "string" && item.value !== null)
          .map((item, idx) => {
            return typeof item !== "string" ? (
              <RollingBoxV2
                heightCalc={heightCalc}
                isStaticHeight={isStaticHeight}
                backgroundColor={
                  getBackgroundColor
                    ? getBackgroundColor({
                        periodLength,
                        value: item.value,
                      })
                    : "success.main"
                }
                value={item.value}
                periodLength={periodLength}
                matches={item.matches}
                key={idx}
                numberFormat={
                  isWide && !numberFormat
                    ? (value) => (value !== null ? value.toFixed(1) : "")
                    : numberFormat
                }
              />
            ) : (
              <></>
            );
          }),
      ];
    }
  );
}
