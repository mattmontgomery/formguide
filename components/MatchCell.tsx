import { useState } from "react";
import { getMLSLink } from "../utils/getLinks";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Box } from "@mui/material";

export default function MatchCell({
  match,
  renderValue,
  resultType = "full-match",
  shadeEmpty = false,
}: {
  match: Results.Match;
  renderValue?: (match: Results.Match) => string | number;
  resultType?: "first-half" | "second-half" | "full-match";
  shadeEmpty?: boolean;
}): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const result =
    resultType === "first-half"
      ? match.firstHalf?.result
      : resultType === "second-half"
      ? match.secondHalf?.result
      : match.result;
  const valueRenderer =
    typeof renderValue !== "function" ? () => result || "-" : renderValue;
  const renderedValue = valueRenderer(match);
  console.log({ result, resultType });
  return (
    <Box
      className={styles.gridRowCell}
      sx={{
        padding: `0.25rem`,
        textAlign: `center`,
        fontWeight: `bold`,
        fontSize: `14px`,
        color: `background.paper`,
        borderRight: `1px solid rgb(181, 181, 181)`,
        position: `relative`,
        cursor: `pointer`,
        opacity: Boolean(shadeEmpty && renderedValue === "-") ? 0.7 : 1,
        filter: Boolean(shadeEmpty && renderedValue === "-")
          ? "grayscale(0.5)"
          : "none",
        backgroundColor: !result
          ? "rgb(200, 200, 200)"
          : result === "W"
          ? "success.main"
          : result === "L"
          ? "error.main"
          : "warning.main",
      }}
    >
      <a
        data-home={match.home ? "home" : null}
        href={getMLSLink(match)}
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
      >
        {open ? <MatchCellDetails match={match} /> : null}
        {renderedValue}
      </a>
    </Box>
  );
}

function MatchCellDetails({
  match,
}: {
  match: Results.Match;
}): React.ReactElement {
  return (
    <div className={styles.matchDetails}>
      <div>{match.home ? "Home" : "Away"}</div>
      <div className={styles.matchDetailsOpponent}>
        <div className={styles.matchDetailsLogo}>
          <Image
            src={match.opponentLogo}
            alt={`${match.opponent} logo`}
            layout="fill"
          />
        </div>
        vs. {match.opponent}
      </div>
      <div>{match.date}</div>
      <div>
        {match.result} {match.scoreline}
      </div>
    </div>
  );
}
