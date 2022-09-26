import styles from "@/styles/Home.module.css";
import { LeagueSeparators } from "@/utils/Leagues";

import { Box, SxProps } from "@mui/material";
import React, { useContext, useState } from "react";
import LeagueContext from "./Context/League";
import { MatchCellProps } from "./MatchCell";
import { Options } from "./Toggle/HomeAwayToggle";

type ProppyArray = [...{ props: { renderValue: () => number } }[]];

function convertToNumber(value: string | number): string | number {
  if (value === "-") {
    return 0;
  } else {
    return +value;
  }
}

function teamNameSort(
  a: [string, ...React.ReactElement[]],
  b: [string, ...React.ReactElement[]]
): 1 | -1 | 0 {
  if (!a || !b) {
    return 0;
  }
  return a[0] > b[0] ? 1 : b[0] > a[0] ? -1 : 0;
}
function weekSort(a: ProppyArray, b: ProppyArray, week: number): 1 | -1 | 0 {
  if (
    !a ||
    !b ||
    typeof a?.[week]?.props?.renderValue !== "function" ||
    typeof b?.[week]?.props?.renderValue !== "function"
  ) {
    return 0;
  }
  const aVal = convertToNumber(a?.[week]?.props?.renderValue());
  const bVal = convertToNumber(b?.[week]?.props?.renderValue());
  return aVal < bVal ? 1 : bVal < aVal ? -1 : 0;
}

export default function MatchGridV2<T extends Results.Match>({
  data,
  dataParser,
  homeAway,
  showMatchdayHeader = true,
  rowSx,
  rowClass = styles.gridRow,
  gridClass = styles.gridClass,
  chartClass = styles.chart,
  getMatchCellProps,
  result,
  sortMethod = (sortStrategy, weekSortIdx) => (a: unknown, b: unknown) => {
    return sortStrategy === "teamName"
      ? teamNameSort(
          a as [string, ...React.ReactElement[]],
          b as [string, ...React.ReactElement[]]
        )
      : sortStrategy === "week"
      ? weekSort(a as ProppyArray, b as ProppyArray, weekSortIdx)
      : 0;
  },
}: {
  data: Record<string, T[]>;
  dataParser: (
    data: Record<string, T[]>
  ) => [string, ...React.ReactElement[]][];
  homeAway: Options;
  showMatchdayHeader?: boolean;
  rowSx?: SxProps;
  rowClass?: string;
  gridClass?: string;
  chartClass?: string;
  result?: Results.ResultTypesAll;
  getMatchCellProps?: (match: T) => Partial<MatchCellProps>;
  sortMethod?: (
    sortStrategy: string,
    weekSortIdx: number
  ) => (a: unknown, b: unknown) => 1 | -1 | 0;
}): React.ReactElement {
  const [sortStrategy, setSortStrategy] = useState<"teamName" | "week">(
    "teamName"
  );
  const [weekSortIdx, setWeekSortIdx] = useState<number>(34);
  const homeShaded = homeAway === "home";
  const awayShaded = homeAway === "away";
  const [teamShaded, setTeamShaded] = useState<string>();

  const league = useContext(LeagueContext);

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
                    color: `text.primary`,
                  }}
                >
                  {i > 0 ? i : null}
                </Box>
              ))}
            </Box>
          )}
          {dataParser(data)
            .sort(sortMethod(sortStrategy, weekSortIdx))
            .map(([team, ...cells], idx) => {
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
                  {React.Children.map(
                    cells,
                    (Cell: React.ReactElement, cellIndex) => {
                      const shouldHaveRightBorder =
                        LeagueSeparators[league] &&
                        LeagueSeparators[league]?.indexOf(cellIndex + 1) !== -1;
                      return React.cloneElement(Cell, {
                        ...(typeof getMatchCellProps === "function"
                          ? getMatchCellProps(Cell.props.match)
                          : {}),
                        rightBorder: shouldHaveRightBorder,
                        isShaded: (match: T) => {
                          const isHomeAwayShaded =
                            typeof teamShaded !== "undefined" && teamShaded
                              ? team === teamShaded
                                ? (homeShaded && !match?.home) ||
                                  (awayShaded && match?.home)
                                : true
                              : (homeShaded && !match?.home) ||
                                (awayShaded && match?.home);
                          const resultShaded =
                            result === "all" ? false : result !== match?.result;
                          return (
                            isHomeAwayShaded ||
                            resultShaded ||
                            (Cell.props.isShaded && Cell.props.isShaded(match))
                          );
                        },
                      });
                    }
                  )}
                </Box>
              );
            })}
        </div>
      </div>
    </Box>
  );
}
