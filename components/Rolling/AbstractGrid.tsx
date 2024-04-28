import styles from "@/styles/Home.module.css";

import { Box, SxProps } from "@mui/material";
import React, { useState } from "react";

import { MatchCellProps } from "@/components/MatchCell";

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
  b: [string, ...React.ReactElement[]],
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

export type AbstractGridProps<T> = {
  data: Record<string, T[]>;
  dataParser: (
    data: Record<string, T[]>,
  ) => [string, ...React.ReactElement[]][];
  showMatchdayHeader?: boolean;
  rowSx?: SxProps;
  rowClass?: string;
  gridClass?: string;
  chartClass?: string;
  result?: Results.ResultTypesAll;
  getMatchCellProps?: (match: T) => Partial<MatchCellProps>;
  sortMethod?: (
    sortStrategy: string,
    weekSortIdx: number,
  ) => (a: unknown, b: unknown) => 1 | -1 | 0;
};

export default function AbstractGrid<T>({
  data,
  dataParser,
  showMatchdayHeader = true,
  rowSx,
  rowClass = styles.gridRow,
  gridClass = styles.gridClass,
  chartClass = styles.chart,
  sortMethod = (sortStrategy, weekSortIdx) => (a: unknown, b: unknown) => {
    return sortStrategy === "teamName"
      ? teamNameSort(
          a as [string, ...React.ReactElement[]],
          b as [string, ...React.ReactElement[]],
        )
      : sortStrategy === "week"
        ? weekSort(a as ProppyArray, b as ProppyArray, weekSortIdx)
        : 0;
  },
}: AbstractGridProps<T>): React.ReactElement {
  const [sortStrategy, setSortStrategy] = useState<"teamName" | "week">(
    "teamName",
  );
  const [weekSortIdx, setWeekSortIdx] = useState<number>(34);
  const [teamShaded, setTeamShaded] = useState<string>();

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
                  {cells}
                </Box>
              );
            })}
        </div>
      </div>
    </Box>
  );
}
