import { Dispatch, SetStateAction, useState } from "react";
import styles from "@/styles/Home.module.css";
import { Box, ClickAwayListener, SxProps } from "@mui/material";
import { getResultBackgroundColor } from "@/utils/results";
export type CellProps = {
  getBackgroundColor: () => string;
  isShaded?: (...args: unknown[]) => boolean;
  onClick?: () => void;
  renderCard?: (setOpen: Dispatch<SetStateAction<boolean>>) => React.ReactNode;
  renderValue: () => React.ReactNode;
  rightBorder?: boolean;
  sx?: SxProps;
};

export default function Cell({
  getBackgroundColor,
  isShaded,
  onClick,
  renderCard,
  renderValue,
  rightBorder = false,
  sx = {},
}: CellProps): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box
      className={styles.gridRowCell}
      sx={{
        textAlign: `center`,
        fontWeight: `bold`,
        fontSize: `14px`,
        color: `background.paper`,
        borderRight: rightBorder
          ? `4px solid black`
          : `1px solid rgb(181, 181, 181)`,
        position: `relative`,
        cursor: `pointer`,
        ...sx,
      }}
    >
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box>
          {open && renderCard ? renderCard(setOpen) : null}
          <Box
            sx={{
              backgroundColor: getBackgroundColor
                ? getBackgroundColor()
                : "background.default",
              padding: "0.25rem",
              color: "grey.800",
              filter:
                isShaded && isShaded()
                  ? "grayscale(0.75) opacity(0.75)"
                  : "none",
            }}
            onClick={() => {
              if (typeof onClick === "function") {
                onClick();
              }
              setOpen(true);
            }}
          >
            <span>{renderValue()}</span>
          </Box>
        </Box>
      </ClickAwayListener>
    </Box>
  );
}

export function getDefaultBackgroundColor(match: Results.Match) {
  switch (match.result) {
    case "W":
    case "D":
    case "L":
      return getResultBackgroundColor(match.result);
    default:
      return "background.default";
  }
}
