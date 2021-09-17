import styles from "../styles/Home.module.css";

import { Box } from "@mui/material";

export default function MatchGrid({
  data,
  dataParser,
  showMatchdayHeader = true,
  rowClass = styles.gridRow,
  gridClass = styles.gridClass,
  showResultControls = true,
}: {
  data: Results.ParsedData["teams"];
  dataParser: (data: Results.ParsedData["teams"]) => Results.RenderReadyData;
  showMatchdayHeader?: boolean;
  rowClass?: string;
  gridClass?: string;
  showResultControls?: boolean;
}): React.ReactElement {
  return (
    <Box m={2}>
      <div className={gridClass}>
        <div className={styles.chart}>
          {showMatchdayHeader && (
            <div className={styles.gridRow}>
              {[...new Array(35)].map((_, i) => (
                <div className={styles.gridRowHeaderCell} key={i}>
                  {i > 0 ? i : null}
                </div>
              ))}
            </div>
          )}
          {dataParser(data)
            .sort(([teamA], [teamB]) => {
              return teamA > teamB ? 1 : -1;
            })
            .map(([team, ...cells], idx) => {
              return (
                <div className={rowClass} key={idx}>
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
