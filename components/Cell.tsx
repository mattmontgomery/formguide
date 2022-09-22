import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import styles from "@/styles/Home.module.css";
import { Box, ClickAwayListener, SxProps } from "@mui/material";
export type MatchCellProps = {
  getBackgroundColor: () => string;
  isShaded?: (...args: unknown[]) => boolean;
  onClick?: () => void;
  renderCard?: (setOpen: Dispatch<SetStateAction<boolean>>) => React.ReactNode;
  rightBorder?: boolean;
  sx?: SxProps;
} & PropsWithChildren;

export default function Cell({
  children,
  getBackgroundColor,
  isShaded,
  onClick,
  renderCard,
  rightBorder = false,
  sx = {},
}: MatchCellProps): React.ReactElement {
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
            <span>{children}</span>
          </Box>
        </Box>
      </ClickAwayListener>
    </Box>
  );
}
