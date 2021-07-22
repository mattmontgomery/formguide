import Head from "next/head";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import fetch from "unfetch";
import { useState } from "react";
import { getMLSLink } from "../utils/getLinks";
import Image, { ImageProps } from "next/image";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const imageLoader = ({ src }: ImageProps) => {
  return src;
};
export default function Home() {
  const { data, error } = useSWR<{ data: Results.ParsedData }>(
    "/api/form",
    fetcher
  );
  return (
    <div className={styles.body}>
      <Head>
        <title>MLS Form Guide 2021</title>
      </Head>
      <h1>MLS Form Guide 2021</h1>
      <div className={styles.grid}>
        <div className={styles.gridRow}>
          {[...new Array(35)].map((_, i) => (
            <div className={styles.gridRowHeaderCell}>{i > 0 ? i : null}</div>
          ))}
        </div>

        {data?.data?.teams
          ? Object.keys(data?.data?.teams)
              .sort()
              .map((team, idx) => (
                <div className={styles.gridRow} key={idx}>
                  <div>{team}</div>
                  {Object.values(data?.data?.teams[team] || {})
                    .sort((a, b) => {
                      return new Date(a.date) > new Date(b.date) ? 1 : -1;
                    })
                    .map((match, idx) => (
                      <MatchCell match={match} key={idx} />
                    ))}
                </div>
              ))
          : null}
      </div>
    </div>
  );
}

function MatchCell({ match }: { match: Results.Match }): React.ReactElement {
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
      {match.result}
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
        <img src={match.opponentLogo} />
        vs. {match.opponent}
      </div>
      <div>{match.date}</div>
      <div>
        {match.result} {match.scoreline}
      </div>
    </div>
  );
}

function Chart({
  data,
}: {
  data: Results.ParsedData["teams"];
}): React.ReactElement {
  return (
    <div className={styles.chart}>
      {parseChartData(data).map(([team, ...points]) => {
        return (
          <div className={styles.chartRow}>
            <div className={styles.chartTeam}>{team}</div>
            {points.map((pointValue) => {
              return (
                <div>
                  <span className={styles.chartPointText}>{pointValue}</span>
                  <span
                    className={styles.chartPointValue}
                    style={{ height: `${(pointValue / 15) * 100}%` }}
                  ></span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function parseChartData(
  teams: Results.ParsedData["teams"]
): [string, ...number[]][] {
  return Object.keys(teams)
    .sort()
    .map((team) => {
      return [
        team,
        ...teams[team].slice(0, teams[team].length - 5).map((_, idx) => {
          return teams[team]
            .slice(idx, idx + 5)
            .map((match) => getMatchPoints(match.result))
            .reduce((prev, currentValue): number => {
              return prev + currentValue;
            }, 0);
        }),
      ];
    });
}

function getMatchPoints(result: "W" | "D" | "L"): number {
  return result === "W" ? 3 : result === "D" ? 1 : 0;
}
