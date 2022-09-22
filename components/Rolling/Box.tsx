import { Box, Card, CardContent, ClickAwayListener } from "@mui/material";
import styles from "@/styles/Home.module.css";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import MatchDescriptor from "../MatchDescriptor";

export default function RollingBox({
  value,
  periodLength,
  matches = [],
  isStaticHeight = true,
  getBackgroundColor,
  numberFormat = (value: number | null): string =>
    typeof value === "number"
      ? Number.isInteger(value)
        ? value.toString()
        : value?.toFixed(1)
      : "",
  heightCalc = (value, periodLength) =>
    `${((value || 0) / (periodLength * 3)) * 100}%`,
  isShaded = () => false,
}: {
  value: number | null;
  periodLength: number;
  matches?: Results.Match[];
  isStaticHeight: boolean;
  getBackgroundColor: (value: number | null, periodLength: number) => string;
  numberFormat?: (value: number | null) => string;
  heightCalc?: (value: number | null, periodLength: number) => string;
  isShaded?: () => boolean;
}): React.ReactElement {
  const [showCard, setShowCard] = useState<boolean>(false);
  const shaded = typeof isShaded === "function" && isShaded();
  return (
    <Box
      sx={{
        opacity: shaded ? 0.5 : 1,
        backgroundColor:
          typeof value === "number" ? "grey.200" : "background.paper",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        height: 40,
      }}
      onClick={() => setShowCard(true)}
    >
      {showCard && (
        <ClickAwayListener onClickAway={() => setShowCard(false)}>
          <Card
            sx={{
              position: "absolute",
              zIndex: 99,
              top: 0,
              left: 32,
              width: 500,
              overflow: "auto",
              cursor: "auto",
            }}
          >
            <CardContent>
              <ol>
                {matches.map((match, idx) => (
                  <li key={idx}>
                    <strong>
                      {format(parseISO(match.rawDate), "yyy-MM-dd")}
                    </strong>
                    : <MatchDescriptor match={match} />
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </ClickAwayListener>
      )}
      <Box
        className={styles.chartPointText}
        sx={{ fontWeight: "bold", color: "grey.900" }}
      >
        {numberFormat(value)}
      </Box>
      <Box
        className={styles.chartPointValue}
        sx={{
          backgroundColor: getBackgroundColor(value, periodLength),
          fontWeight: "bold",
          zIndex: 9,
          position: `absolute`,
          bottom: 0,
          left: 0,
          right: 0,
          height: isStaticHeight ? "100%" : heightCalc(value, periodLength),
        }}
      ></Box>
    </Box>
  );
}
