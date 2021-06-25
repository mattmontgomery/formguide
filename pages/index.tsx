import Head from "next/head";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import fetch from "unfetch";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data, error } = useSWR<{ data: Results.ParsedData }>(
    "/api/form",
    fetcher
  );
  return (
    <div className={styles.grid}>
      {data?.data?.teams
        ? Object.keys(data?.data?.teams)
            .sort()
            .map((team) => (
              <div className={styles.gridRow}>
                <div>{team}</div>
                {Object.values(data?.data?.teams[team] || {})
                  .sort((a, b) => {
                    return new Date(a.date) > new Date(b.date) ? 1 : -1;
                  })
                  .map((match) => (
                    <MatchCell match={match} />
                  ))}
              </div>
            ))
        : null}
    </div>
  );
}

function MatchCell({ match }: { match: Results.Match }): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div
      onMouseOver={() => setOpen(true)}
      onMouseOut={() => setOpen(false)}
      className={styles[match.result || "NA"]}
    >
      {open ? <MatchCellDetails match={match} /> : null}
      {match.result}
    </div>
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
      <div>vs. {match.opponent}</div>
      <div>{match.date}</div>
      <div>
        {match.result} {match.scoreline}
      </div>
    </div>
  );
}
