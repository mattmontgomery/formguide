import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";

import styles from "../../styles/Home.module.css";
import fetch from "unfetch";
import MatchGrid from "../../components/MatchGrid";
import getMatchPoints from "../../utils/getMatchPoints";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Chart() {
  const router = useRouter();
  const { period = 5 } = router.query;
  const periodLength: number =
    +period.toString() > 0 && +period.toString() < 34 ? +period.toString() : 5;
  const { data, error } = useSWR<{ data: Results.ParsedData }>(
    "/api/form",
    fetcher
  );
  return (
    <div className={styles.body}>
      <Head>
        <title>MLS Form Guide 2021 | chart</title>
      </Head>
      <h1>Rolling points ({period} game rolling)</h1>
      {data?.data?.teams ? (
        <MatchGrid
          data={data.data.teams}
          dataParser={(...args) => dataParser(periodLength, ...args)}
          showMatchdayHeader={false}
          rowClass={styles.chartRow}
        />
      ) : null}
    </div>
  );
}

function dataParser(
  periodLength: number,
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  return parseChartData(data, periodLength).map(([team, ...points]) => {
    return [
      team,
      ...points.map((pointValue, idx) => {
        return (
          <div key={idx}>
            <span className={styles.chartPointText}>{pointValue}</span>
            <span
              className={styles.chartPointValue}
              style={{
                height: `${((pointValue || 0) / (periodLength * 3)) * 100}%`,
              }}
            ></span>
          </div>
        );
      }),
    ];
  });
}

function parseChartData(
  teams: Results.ParsedData["teams"],
  periodLength: number = 5
): [string, ...Array<number | null>][] {
  return Object.keys(teams)
    .sort()
    .map((team) => {
      return [
        team,
        ...teams[team]
          .slice(0, teams[team].length - periodLength)
          .map((_, idx) => {
            const results = teams[team]
              .sort((a, b) => {
                return new Date(a.date) > new Date(b.date) ? 1 : -1;
              })
              .slice(idx, idx + periodLength)
              .filter((match) => match.result !== null)
              .map((match) => getMatchPoints(match.result));
            return results.length !== periodLength
              ? null
              : results.reduce((prev, currentValue): number => {
                  return prev + currentValue;
                }, 0);
          }),
      ];
    });
}
