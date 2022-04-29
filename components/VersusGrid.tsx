import styles from "@/styles/Home.module.css";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

type TeamData = Record<string, Record<string, number[]>>;

export default function VersusGrid({
  data,
  renderValue,
  getValue,
  getBackgroundColor,
  getForegroundColor,
}: {
  data: Results.ParsedData;
  renderValue: (values: number[]) => number | string;
  getValue: (result: Results.Match) => number;
  getBackgroundColor: (
    value: number[]
  ) =>
    | "common.white"
    | "success.main"
    | "error.main"
    | "warning.main"
    | "background.paper"
    | "transparent";
  getForegroundColor: (
    value: number[]
  ) =>
    | "success.contrastText"
    | "error.contrastText"
    | "warning.contrastText"
    | "text.primary"
    | "transparent";
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
            <Box
              className={styles.gridRow}
              key={idx}
              sx={{ backgroundColor: idx % 2 ? "grey.50" : "grey.200" }}
            >
              <span></span>
              <Box
                sx={{
                  color: "common.black",
                  textAlign: "right",
                  fontSize: 12,
                  alignSelf: "center",
                  paddingRight: 1,
                  "white-space": "nowrap",
                }}
              >
                {team}
              </Box>
              {Object.keys(teamData)
                .sort()
                .map((t, idx) =>
                  t === team ? (
                    <Box
                      sx={{
                        backgroundColor: "grey.400",
                        textAlign: "center",
                      }}
                      key={idx}
                    >
                      {"-"}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        fontSize: "9pt",
                        fontWeight: "bold",
                        paddingTop: "2px",
                        borderWidth: "1px 1px 0 1px",
                        borderStyle: "solid",
                        borderColor: "grey.300",
                        backgroundColor: getBackgroundColor(teamData[team][t]),
                        foregroundColor: getForegroundColor(teamData[team][t]),
                      }}
                    >
                      {teamData[team][t] ? renderValue(teamData[team][t]) : ""}
                    </Box>
                  )
                )}
            </Box>
          ))}
      </div>
    </>
  );
}
