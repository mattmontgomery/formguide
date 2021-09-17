import { useState } from "react";
import { getMLSLink } from "../utils/getLinks";
import styles from "../styles/Home.module.css";
import Image from "next/image";

export default function MatchCell({
  match,
  renderValue = (match) => match.result,
  wide = false,
}: {
  match: Results.Match;
  renderValue?: (match: Results.Match) => string | number;
  wide?: boolean;
}): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <a
      data-home={match.home ? "home" : null}
      href={getMLSLink(match)}
      onMouseOver={() => setOpen(true)}
      onMouseOut={() => setOpen(false)}
      className={styles[match.result || "NA"]}
    >
      {open ? <MatchCellDetails match={match} /> : null}
      {renderValue(match)}
    </a>
  );
}

function MatchCellDetails({
  match,
}: {
  match: Results.Match;
}): React.ReactElement {
  const date = new Date(match.date);
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
