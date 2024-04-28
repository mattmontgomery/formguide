import styles from "@/styles/Home.module.css";
import { LeagueSeparators } from "@/utils/Leagues";
import { sortByDate } from "@/utils/sort";

import { Box, SxProps } from "@mui/material";
import React, { useContext, useMemo, useState } from "react";
import LeagueContext from "../Context/League";
import { Options } from "../Toggle/HomeAwayToggle";
import Cell, { CellProps, getDefaultBackgroundColor } from "./Cell";
import MatchDetails from "./MatchDetails";

export type GridProps<T extends Results.Match> = {
  data: Record<string, T[]>;
  getBackgroundColor?: (
    match: T,
  ) => ReturnType<CellProps["getBackgroundColor"]>;
  getCellProps?: (match: T) => Partial<CellProps>;
  getShaded?: (match: T) => boolean;
  getValue: (match: T) => React.ReactNode;
  homeAway: Options;
  showMatchdayHeader?: boolean;
  rowSx?: SxProps;
  rowClass?: string;
  gridClass?: string;
  chartClass?: string;
  result?: Results.ResultTypesAll;
  sortMethod?: (
    sortStrategy: string,
    weekSortIdx: number,
  ) => (a: unknown, b: unknown) => 1 | -1 | 0;
};

export default function MatchGrid<T extends Results.Match>({
  data,
  getBackgroundColor = getDefaultBackgroundColor,
  getCellProps = () => ({}),
  getShaded = () => false,
  getValue,
  homeAway,
  showMatchdayHeader = true,
  rowSx,
  rowClass = styles.gridRow,
  gridClass = styles.gridClass,
  chartClass = styles.chart,
  result,
}: GridProps<T>): React.ReactElement {
  const [sortStrategy, setSortStrategy] = useState<"teamName" | "week">(
    "teamName",
  );
  const [weekSortIdx, setWeekSortIdx] = useState<number>();
  const homeShaded = homeAway === "home";
  const awayShaded = homeAway === "away";
  const [teamShaded, setTeamShaded] = useState<string>();

  const league = useContext(LeagueContext);
  const dataValues: Record<string, React.ReactNode[]> = useMemo(() => {
    return Object.keys(data)
      .map((team) => {
        return {
          [team]: data[team].sort(sortByDate).map(getValue),
        };
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }, [data, getValue]);
  const sortedKeys = useMemo(() => {
    const sortMethod =
      sortStrategy === "week" && weekSortIdx
        ? function (a: string, b: string) {
            const aValue = dataValues[a][weekSortIdx - 1] ?? 0;
            const bValue = dataValues[b][weekSortIdx - 1] ?? 0;
            if (Number.isNaN(aValue) || aValue === "") {
              return 1;
            } else if (Number.isNaN(bValue) || bValue === "") {
              return -1;
            }
            return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
          }
        : undefined;
    return Object.keys(dataValues).sort(sortMethod);
  }, [dataValues, sortStrategy, weekSortIdx]);

  return (
    <Box>
      <div className={gridClass}>
        <div className={chartClass}>
          {showMatchdayHeader && (
            <Box className={styles.gridRow}>
              <span></span>
              {[...new Array(35)].map((_, i) => (
                <Box
                  className={styles.gridRowHeaderCell}
                  key={i}
                  onClick={() => {
                    setSortStrategy(i > 0 ? "week" : "teamName");
                    setWeekSortIdx(i);
                  }}
                  sx={{
                    color: weekSortIdx === i ? "primary.dark" : "text.primary",
                  }}
                >
                  {i > 0 ? i : null}
                </Box>
              ))}
            </Box>
          )}
          {sortedKeys.map((team, idx) => {
            const values = data[team];
            return (
              <Box className={rowClass} key={idx} sx={rowSx}>
                <span>{sortStrategy === "week" ? idx + 1 : ""}</span>
                <Box
                  sx={{
                    textAlign: "right",
                    alignSelf: `center`,
                    marginRight: 1,
                    fontSize: 13,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                  className={styles.chartTeam}
                  onClick={() =>
                    teamShaded === team
                      ? setTeamShaded("")
                      : setTeamShaded(team)
                  }
                >
                  {team}
                </Box>
                {[...values].map((value: T, idx) => {
                  return (
                    <Cell
                      {...(typeof getCellProps === "function"
                        ? getCellProps(value)
                        : {})}
                      renderValue={() => dataValues[team][idx]}
                      getBackgroundColor={() => getBackgroundColor(value)}
                      key={idx}
                      isShaded={() => {
                        const isHomeAwayShaded = teamShaded
                          ? team === teamShaded
                            ? (homeShaded && !value?.home) ||
                              (awayShaded && value?.home)
                            : true
                          : (homeShaded && !value?.home) ||
                            (awayShaded && value?.home);
                        const resultShaded =
                          result === "all" ? false : result !== value?.result;
                        return (
                          isHomeAwayShaded || resultShaded || getShaded(value)
                        );
                      }}
                      renderCard={(setOpen) => (
                        <MatchDetails
                          match={value}
                          onClose={() => setOpen(false)}
                        />
                      )}
                      rightBorder={
                        LeagueSeparators[league] &&
                        LeagueSeparators[league]?.indexOf(idx + 1) !== -1
                      }
                    />
                  );
                })}
              </Box>
            );
          })}
        </div>
      </div>
    </Box>
  );
}
