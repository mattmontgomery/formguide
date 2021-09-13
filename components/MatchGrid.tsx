import styles from "../styles/Home.module.css";

export default function MatchGrid({
  data,
  dataParser,
  showMatchdayHeader = true,
  rowClass = styles.gridRow,
}: {
  data: Results.ParsedData["teams"];
  dataParser: (data: Results.ParsedData["teams"]) => Results.RenderReadyData;
  showMatchdayHeader?: boolean;
  rowClass?: string;
}): React.ReactElement {
  return (
    <div className={styles.grid}>
      <div className={styles.chart}>
        <div className={styles.gridRow}>
          {[...new Array(35)].map((_, i) => (
            <div className={styles.gridRowHeaderCell}>{i > 0 ? i : null}</div>
          ))}
        </div>
        {dataParser(data)
          .sort(([teamA], [teamB]) => {
            return teamA > teamB ? 1 : -1;
          })
          .map(([team, ...cells]) => {
            return (
              <div className={rowClass}>
                <div className={styles.chartTeam}>{team}</div>
                {cells}
              </div>
            );
          })}
      </div>
    </div>
  );
}
