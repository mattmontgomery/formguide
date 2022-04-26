import styles from "@/styles/Home.module.css";

import {
  Box,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import React, { useState } from "react";

type ProppyArray = [...{ props: { renderValue: () => number } }[]];

function convertHyphenToZero(value: string | number): string | number {
  if (value === "-") {
    return 0;
  } else {
    return value;
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
    typeof a?.[week].props?.renderValue !== "function" ||
    typeof b?.[week].props?.renderValue !== "function"
  ) {
    return 0;
  }
  const aVal = convertHyphenToZero(a?.[week].props?.renderValue());
  const bVal = convertHyphenToZero(b?.[week].props?.renderValue());
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
  dataParser: (data: Results.ParsedData["teams"]) => Render.RenderReadyData;
  showMatchdayHeader?: boolean;
  rowClass?: string;
  gridClass?: string;
}): React.ReactElement {
  const [sortStrategy, setSortStrategy] = useState<"teamName" | "week">(
    "teamName"
  );
  const [weekSortIdx, setWeekSortIdx] = useState<number>(34);
  const [homeShaded, setHomeShaded] = useState<boolean>(false);
  const [awayShaded, setAwayShaded] = useState<boolean>(false);
  const [teamShaded, setTeamShaded] = useState<string>();

  return (
    <Box>
      {showMatchdayHeader && (
        <>
          <Box marginBottom={2}>
            <FormGroup sx={{ flexDirection: "row" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!homeShaded}
                    onChange={(ev) => setHomeShaded(!ev.target.checked)}
                  />
                }
                label="Home"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={!awayShaded}
                    onChange={(ev) => setAwayShaded(!ev.target.checked)}
                  />
                }
                label="Away"
              />
            </FormGroup>
          </Box>
          <Divider />
        </>
      )}
      <div className={gridClass}>
        <div className={styles.chart}>
          {showMatchdayHeader && (
            <div className={styles.gridRow}>
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
                  <Box
                    sx={{
                      textAlign: "right",
                      alignSelf: `center`,
                      fontWeight: `bold`,
                      marginRight: `.5rem`,
                      fontSize: "12px",
                      cursor: "pointer",
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
                  {React.Children.map(cells, (Cell: React.ReactElement) => {
                    return React.cloneElement(Cell, {
                      isShaded: (match: Results.Match) =>
                        typeof teamShaded !== "undefined" && teamShaded
                          ? match.team === teamShaded
                            ? (homeShaded && match.home) ||
                              (awayShaded && !match.home)
                            : true
                          : (homeShaded && match.home) ||
                            (awayShaded && !match.home),
                    });
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </Box>
  );
}
