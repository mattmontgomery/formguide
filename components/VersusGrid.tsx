import styles from "@/styles/Home.module.css";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

type TeamData = Record<string, Record<string, number[]>>;

export default function VersusGrid({
  data,
  renderValue,
  getValue,
  getBackgroundColor,
}: {
  data: Results.ParsedData;
  renderValue: (values: number[]) => number | string;
  getValue: (result: Results.Match) => number;
  getBackgroundColor: (
    value: number[]
  ) => "success.main" | "error.main" | "warning.main" | "#f0f0f0";
}): React.ReactElement {
  const [teamData, setTeamData] = useState<TeamData>({});
  useEffect(() => {
    const collated: TeamData = {};
    Object.keys(data.teams).forEach((team) => {
      data.teams[team]
        .filter((result) => result.status.long === "Match Finished")
        .forEach((result) => {
          if (typeof collated[team] === "undefined") {
            collated[team] = {};
          }
          if (typeof collated[team][result.opponent] === "undefined") {
            collated[team][result.opponent] = [];
          }
          collated[team][result.opponent].push(getValue(result));
        });
    });
    setTeamData(collated);
  }, [data, getValue]);
  return (
    <>
      <div className={styles.gridExtraWide}>
        <div className={styles.chart}>
          <div
            className={styles.gridRow}
            style={{
              position: "relative",
              left: "-4.5rem",
              paddingTop: "10rem",
              fontSize: "9pt",
              fontWeight: "bold",
            }}
          >
            <span></span>
            <span></span>
            {Object.keys(teamData)
              .sort()
              .map((team, idx) => (
                <span
                  key={idx}
                  style={{
                    transform: "rotate(-90deg)",
                    width: "12rem",
                    textAlign: "left",
                    position: "relative",
                    bottom: "6rem",
                  }}
                >
                  {team}
                </span>
              ))}
          </div>
          {Object.keys(teamData)
            .sort()
            .map((team, idx) => (
              <div className={styles.gridRow} key={idx}>
                <span></span>
                <div className={styles.chartTeamSmall}>{team}</div>
                {Object.keys(teamData)
                  .sort()
                  .map((t, idx) =>
                    t === team ? (
                      <div className={styles.gridFilledGrey} key={idx}>
                        {"-"}
                      </div>
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          fontSize: "9pt",
                          alignContent: "middle",
                          justifyContent: "middle",
                          borderRight: "1px solid black",
                          backgroundColor: getBackgroundColor(
                            teamData[team][t]
                          ),
                        }}
                      >
                        {teamData[team][t]
                          ? renderValue(teamData[team][t])
                          : ""}
                      </Box>
                    )
                  )}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
