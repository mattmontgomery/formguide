import {
  Box,
  Card,
  CardContent,
  ClickAwayListener,
  Typography,
} from "@mui/material";
import styles from "@/styles/Home.module.css";
import { format } from "date-fns";
import { useState } from "react";

export default function RollingBox({
  value,
  periodLength,
  matches = [],
  isStaticHeight = true,
  getBackgroundColor,
  numberFormat = (value: number | null): string =>
    value
      ? Number.isInteger(value)
        ? value.toString()
        : value?.toFixed(1)
      : "",
}: {
  value: number | null;
  periodLength: number;
  matches?: { date: Date; title: string }[];
  isStaticHeight: boolean;
  getBackgroundColor: (value: number | null, periodLength: number) => string;
  numberFormat?: (value: number | null) => string;
}): React.ReactElement {
  const [showCard, setShowCard] = useState<boolean>(false);
  return (
    <Box
      sx={{
        backgroundColor:
          typeof value === "number" ? "grey.200" : "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        height: 30,
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
              left: 30,
              width: 500,
              overflow: "auto",
              cursor: "auto",
            }}
          >
            <CardContent>
              <ol>
                {matches.map((match, idx) => (
                  <li key={idx}>
                    <Typography variant="overline">
                      {format(match.date, "yyy-MM-dd")}
                    </Typography>
                    <br />
                    <Typography>{match.title}</Typography>
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
          height: isStaticHeight
            ? "100%"
            : `${((value || 0) / (periodLength * 3)) * 100}%`,
        }}
      ></Box>
    </Box>
  );
}
