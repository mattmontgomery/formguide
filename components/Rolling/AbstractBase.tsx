import styles from "@/styles/Home.module.css";
import BaseDataPage, { DataPageProps } from "@/components/BaseDataPage";
import { format } from "util";
import { BasePageProps } from "../BasePage";
import { Box } from "@mui/system";
import { getArrayAverage } from "@/utils/array";
import React, { useCallback, useEffect } from "react";
import { PeriodLengthOptions, usePeriodLength } from "../Toggle/PeriodLength";
import { useRouter } from "next/router";
import { NumberFormat } from "./BoxV2";
import AbstractGrid from "./AbstractGrid";

export type BaseRollingPageProps<T, ValueType, DataType, ParsedDataType> = {
  pageTitle: string;
  filterMatches?: (match: T) => boolean;
  getBackgroundColor?: (args: {
    periodLength: number;
    value: number | null;
  }) => string;
  getBoxHeight?: (value: number | null, periodLength: number) => string;
  getData: (data: DataType) => ParsedDataType;
  getEndpoint?: DataPageProps["getEndpoint"];
  getSummaryValue?: (values: ValueType[]) => number;
  getValue: (match: T) => ValueType | undefined;
  isWide?: boolean;
  numberFormat?: NumberFormat;
  max?: number;
  renderBox: (
    item: { matches: T[]; value: number | null },
    periodLength: number,
  ) => React.ReactNode;
  renderControls?: BasePageProps["renderControls"];
};

export default function AbstractBaseRollingPage<
  T,
  ValueType = number,
  DataType = { teams: Record<string, T[]> },
  ParsedDataType = T,
>({
  children,
  getData,
  getEndpoint,
  getSummaryValue = (values) => getArrayAverage(values as unknown as number[]),
  getValue,
  filterMatches = () => true,
  isWide = false,
  pageTitle,
  renderBox,
  renderControls,
}: React.PropsWithChildren<
  BaseRollingPageProps<T, ValueType, DataType, ParsedDataType>
>): React.ReactElement {
  const router = useRouter();
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
                  .filter(filterMatches)
                  .slice(idx, idx + periodLength);
                const valueSet = resultSet.map(getValue);
                return {
                  value:
                    valueSet.length !== periodLength
                      ? null
                      : getSummaryValue(
                          valueSet.filter(
                            (v) => typeof v !== "undefined",
                          ) as ValueType[],
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
                <React.Fragment key={idx}>
                  {renderBox(item, periodLength)}
                </React.Fragment>
              ) : (
                <>{item}</>
              );
            }),
          ];
        },
      );
    },
    [filterMatches, getSummaryValue, getValue, periodLength, renderBox],
  );
  return (
    <BaseDataPage<DataType>
      {...(getEndpoint
        ? {
            getEndpoint,
          }
        : {})}
      renderControls={() => (
        <Box sx={{ display: "flex", gap: 2, gridAutoColumns: 2 }}>
          {renderPeriodLength()}
          {renderControls && renderControls()}
        </Box>
      )}
      pageTitle={format(pageTitle, periodLength)}
      renderComponent={(data) => {
        const parsedData = getData(data);
        return parsedData ? (
          <AbstractGrid
            rowSx={{
              display: "grid",
              gridTemplateColumns: `25px 160px repeat(46, ${
                isWide ? 48 : 36
              }px)`,
            }}
            chartClass={isWide ? styles.chartWide : styles.chart}
            data={parsedData}
            dataParser={(data) => dataParser(data as Record<string, T[]>)}
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
