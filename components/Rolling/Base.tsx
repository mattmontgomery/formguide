import { DataPageProps } from "@/components/BaseDataPage";
import { BasePageProps } from "../BasePage";
import { useHomeAway } from "../Toggle/HomeAwayToggle";
import React from "react";
import RollingBoxV2, { NumberFormat } from "./BoxV2";
import AbstractBaseRollingPage from "./AbstractBase";
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
  T extends Results.Match =
    | Results.Match
    | Results.MatchWithStatsData
    | Results.MatchWithGoalData,
  ValueType = number,
>(
  props: React.PropsWithChildren<BaseRollingPageProps<T, ValueType>>,
): React.ReactElement {
  const { value: homeAway, renderComponent: renderHomeAwayToggle } =
    useHomeAway();
  return (
    <AbstractBaseRollingPage<
      T,
      ValueType,
      { teams: Record<string, T[]> },
      Record<string, T[]>
    >
      getData={(data) =>
        Object.keys(data.teams).reduce((acc, team: string) => {
          const matches = data.teams[team] as unknown as T[];
          return {
            ...acc,
            [team]:
              typeof data.teams === "object" && data.teams
                ? matches.sort(sortByDate)
                : [],
          };
        }, {})
      }
      filterMatches={(m) =>
        (homeAway === "all" ? true : m.home === (homeAway === "home")) &&
        m.result !== null
      }
      renderBox={(item, periodLength) => {
        return (
          <RollingBoxV2
            backgroundColor={
              props.getBackgroundColor
                ? props.getBackgroundColor({
                    periodLength,
                    value: item.value,
                  })
                : "success.main"
            }
            boxHeight={
              props.getBoxHeight
                ? props.getBoxHeight(item.value, periodLength)
                : "100%"
            }
            numberFormat={
              props.isWide && !props.numberFormat
                ? (value: number | null) =>
                    value !== null ? value.toFixed(1) : ""
                : props.numberFormat
            }
            value={item.value}
          />
        );
      }}
      renderControls={() => <>{renderHomeAwayToggle()}</>}
      {...props}
    />
  );
}
