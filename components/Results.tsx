import React from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { Box } from "@mui/material";
import { ActionImpl, KBarResults, useMatches } from "kbar";

export default function Results({ darkMode }: { darkMode: boolean }) {
  const { results } = useMatches();
  return (
    <KBarResults
      maxHeight={500}
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <ResultItemWithRef
            item={{ name: item }}
            active={active}
            darkMode={darkMode}
          />
        ) : (
          <ResultItemWithRef item={item} active={active} darkMode={darkMode} />
        )
      }
    />
  );
}

type ResultItemProps = {
  item: Partial<ActionImpl>;
  active: boolean;
  darkMode: boolean;
};

export function ResultItem({
  item,
  active,
  darkMode,
}: ResultItemProps): React.ReactElement {
  const Icon =
    typeof item.icon === "object"
      ? (item.icon as unknown as SvgIconComponent)
      : React.Fragment;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        padding: ".5rem 1rem",
        margin: "0.25rem",
        transition: "all 0.125s ease",
        ...(active
          ? {
              borderRadius: "0.25rem",
              backgroundColor: darkMode ? "rgb(0, 30, 60)" : "#eee",
              border: "1px solid rgb(30, 60, 90)",
              fontWeight: "bold",
            }
          : {
              border: "1px solid transparent",
            }),
      }}
    >
      <Box sx={{ paddingRight: 1, display: "flex", color: "grey.500" }}>
        {item.icon && <Icon />}
      </Box>
      <span>{typeof item === "string" ? item : item.name}</span>
    </Box>
  );
}

// eslint-disable-next-line react/display-name
const ResultItemWithRef = React.forwardRef((props: ResultItemProps) => (
  <ResultItem {...props} />
));
