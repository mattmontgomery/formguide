import styles from "@/styles/Home.module.css";
import BaseDataPage, { DataPageProps } from "@/components/BaseDataPage";
import { format } from "util";
import { BasePageProps } from "../BasePage";
import { Box } from "@mui/system";
import { useHomeAway } from "../Toggle/HomeAwayToggle";
import { getArrayAverage } from "@/utils/array";
import React, { useCallback, useEffect } from "react";
import MatchGridV2 from "../MatchGridV2";
import { PeriodLengthOptions, usePeriodLength } from "../Toggle/PeriodLength";
import { useRouter } from "next/router";
import RollingBoxV2, { NumberFormat } from "./BoxV2";
import { sortByDate } from "@/utils/sort";

export type BaseRollingPageProps<T, ValueType> = {
  pageTitle: string;
  getBackgroundColor?: (args: {
    periodLength: number;
    value: number | null;
  }) => string;
  getSummaryValue?: (values: ValueType[]) => number;
  getValue: (match: T) => ValueType | undefined;
  getEndpoint?: DataPageProps["getEndpoint"];
  getBoxHeight?: (value: number | null, periodLength: number) => string;
  isWide?: boolean;
  numberFormat?: NumberFormat;
  max?: number;
  renderControls?: BasePageProps["renderControls"];
};

export default function BaseRollingPage<
  T extends Results.Match,
  ValueType = number
>({
  children,
  getBackgroundColor = () => "success.light",
  getEndpoint,
  getSummaryValue = (value) => getArrayAverage(value as unknown as number[]),
  getValue,
  getBoxHeight,
  isWide = false,
  numberFormat,
  pageTitle,
  renderControls,
}: React.PropsWithChildren<
  BaseRollingPageProps<T, ValueType>
>): React.ReactElement {
  const router = useRouter();
  const { value: homeAway, renderComponent: renderHomeAwayToggle } =
    useHomeAway();
  const { period = 5 } = router.query;
  const defaultPeriodLength: PeriodLengthOptions =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const {
    value: periodLength,
    setValue: setPeriodLength,
    renderComponent: renderPeriodLength,
  } = usePeriodLength(defaultPeriodLength);

  useEffect(() => {
    setPeriodLength(defaultPeriodLength);
  }, [defaultPeriodLength, setPeriodLength]);

  const dataParser = useCallback(
    (data: Record<string, T[]>) => {
      const parsedData = Object.keys(data)
        .sort()
        .map((team) => {
          return [
            team,
            ...data[team]
              .slice(0, data[team].length - periodLength)
              .map((_, idx) => {
                const resultSet = data[team]
                  .sort(sortByDate)
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
                            (v) => typeof v !== "undefined"
                          ) as ValueType[]
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
            ...values.map((item, idx) => {
              return typeof item !== "string" ? (
                <RollingBoxV2
                  boxHeight={
                    getBoxHeight
                      ? getBoxHeight(item.value, periodLength)
                      : "100%"
                  }
                  backgroundColor={
                    getBackgroundColor
                      ? getBackgroundColor({
                          periodLength,
                          value: item.value,
                        })
                      : "success.main"
                  }
                  value={item.value}
                  matches={item.matches}
                  key={idx}
                  numberFormat={
                    isWide && !numberFormat
                      ? (value) => (value !== null ? value.toFixed(1) : "")
                      : numberFormat
                  }
                />
              ) : (
                <>{item}</>
              );
            }),
          ];
        }
      );
    },
    [
      getBackgroundColor,
      getBoxHeight,
      getSummaryValue,
      getValue,
      homeAway,
      isWide,
      numberFormat,
      periodLength,
    ]
  );
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
            dataParser={(data) => dataParser(data)}
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
