import { Box, Card, CardContent, ClickAwayListener } from "@mui/material";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

export type NumberFormat = (value: number | null) => string;

export type AbstractRollingBoxProps = {
  backgroundColor: string;
  boxHeight: string;
  numberFormat?: NumberFormat;
  renderCardContent?: () => React.ReactNode;
  value: number | null;
};

export default function AbstractRollingBox({
  backgroundColor,
  boxHeight,
  numberFormat = (value: number | null): string =>
    typeof value === "number"
      ? Number.isInteger(value)
        ? value.toString()
        : value?.toFixed(1)
      : "",
  renderCardContent,
  value,
}: AbstractRollingBoxProps): React.ReactElement {
  const [showCard, setShowCard] = useState<boolean>(false);
  return (
    <Box
      sx={{
        backgroundColor:
          typeof value === "number" ? "grey.200" : "background.paper",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        position: "relative",
        height: 50,
      }}
      onClick={() => setShowCard(true)}
    >
      {renderCardContent && showCard && (
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
              {(renderCardContent && renderCardContent()) ?? <></>}
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
        sx={{
          backgroundColor,
          fontWeight: "bold",
          zIndex: 9,
          position: `absolute`,
          bottom: 0,
          left: 0,
          right: 0,
          height: boxHeight,
        }}
      ></Box>
    </Box>
  );
}
