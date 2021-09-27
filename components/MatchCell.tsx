import { useState } from "react";
import { getMLSLink } from "../utils/getLinks";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { Box } from "@mui/material";

export default function MatchCell({
  match,
  renderValue = (match) => match.result || "-",
}: {
  match: Results.Match;
  renderValue?: (match: Results.Match) => string | number;
}): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
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
        backgroundColor: !match.result
          ? "rgb(213, 213, 213)"
          : match.result === "W"
          ? "#8cca7a"
          : match.result === "L"
          ? "#f3968f"
          : "#f9c389",
      }}
    >
      <a
        data-home={match.home ? "home" : null}
        href={getMLSLink(match)}
        onMouseOver={() => setOpen(true)}
        onMouseOut={() => setOpen(false)}
      >
        {open ? <MatchCellDetails match={match} /> : null}
        {renderValue(match)}
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
