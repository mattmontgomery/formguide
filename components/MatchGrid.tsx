import styles from "../styles/Home.module.css";

import { Box } from "@mui/material";
import React, { useState } from "react";

type ProppyArray = [...{ props: { renderValue: () => number } }[]];

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
  if (!a || !b) {
    return 0;
  }
  const aVal = a[week].props?.renderValue();
  const bVal = b[week].props?.renderValue();
  return aVal < bVal ? 1 : bVal < aVal ? -1 : 0;
}

export default function MatchGrid({
  data,
  dataParser,
  showMatchdayHeader = true,
  rowClass = styles.gridRow,
  gridClass = styles.gridClass,
}: {
  data: Results.ParsedData["teams"];
  dataParser: (data: Results.ParsedData["teams"]) => Results.RenderReadyData;
  showMatchdayHeader?: boolean;
  rowClass?: string;
  gridClass?: string;
}): React.ReactElement {
  const [sortStrategy, setSortStrategy] = useState<"teamName" | "week">(
    "teamName"
  );
  const [weekSortIdx, setWeekSortIdx] = useState<number>(34);
  return (
    <Box m={2}>
      <div className={gridClass}>
        <div className={styles.chart}>
          {showMatchdayHeader && (
            <div className={styles.gridRow}>
              <span></span>
              {[...new Array(35)].map((_, i) => (
                <div
                  className={styles.gridRowHeaderCell}
                  key={i}
                  onClick={() => {
                    setSortStrategy(i > 0 ? "week" : "teamName");
                    setWeekSortIdx(i);
                  }}
                >
                  {i > 0 ? i : null}
                </div>
              ))}
            </div>
          )}
          {dataParser(data)
            .sort((a, b) => {
              return sortStrategy === "teamName"
                ? teamNameSort(a, b)
                : sortStrategy === "week"
                ? weekSort(a as ProppyArray, b as ProppyArray, weekSortIdx)
                : 0;
            })
            .map(([team, ...cells], idx) => {
              return (
                <div className={rowClass} key={idx}>
                  <span>{sortStrategy === "week" ? idx + 1 : ""}</span>
                  <div className={styles.chartTeam}>{team}</div>
                  {cells}
                </div>
              );
            })}
        </div>
      </div>
    </Box>
  );
}
