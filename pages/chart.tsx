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
    <div className={styles.body}>
      <Head>
        <title>MLS Form Guide 2021 | chart</title>
      </Head>
      <h1>Rolling points (5 game rolling)</h1>
      <div className={styles.grid}>
        {data?.data?.teams ? <Chart data={data.data.teams} /> : null}
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
                    style={{ height: `${((pointValue || 0) / 15) * 100}%` }}
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
): [string, ...Array<number | null>][] {
  return Object.keys(teams)
    .sort()
    .map((team) => {
      return [
        team,
        ...teams[team].slice(0, teams[team].length - 5).map((_, idx) => {
          const results = teams[team]
            .sort((a, b) => {
              return new Date(a.date) > new Date(b.date) ? 1 : -1;
            })
            .slice(idx, idx + 5)
            .filter((match) => match.result !== null)
            .map((match) => getMatchPoints(match.result));
          return results.length !== 5
            ? null
            : results.reduce((prev, currentValue): number => {
                return prev + currentValue;
              }, 0);
        }),
      ];
    });
}

function getMatchPoints(result: "W" | "D" | "L"): number {
  return result === "W" ? 3 : result === "D" ? 1 : 0;
}
