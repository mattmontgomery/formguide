import Head from "next/head";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import fetch from "unfetch";
import MatchCell from "../components/MatchCell";
import MatchGrid from "../components/MatchGrid";
import getMatchPoints from "../utils/getMatchPoints";
import getTeamPoints from "../utils/getTeamPoints";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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
      <h1>Opponent PPG before given match</h1>

      {data?.data?.teams ? (
        <MatchGrid
          data={data.data.teams}
          dataParser={dataParser}
          gridClass={styles.gridWide}
        />
      ) : null}
      <h1>Team PPG before given match</h1>

      {data?.data?.teams ? (
        <MatchGrid
          data={data.data.teams}
          dataParser={dataParserTeam}
          gridClass={styles.gridWide}
        />
      ) : null}

      <h1>Expected Outcome {"(ppg > opponent ppg)"}</h1>
      <h3>Key</h3>
      <ul>
        <li>++: Beat team with greater PPG</li>
        <li>+: Beat team with lesser PPG</li>
        <li>{"//: Drew team with greater PPG"}</li>
        <li>{"/: Drew team with lesser PPG"}</li>
        <li>-: Lost to team with greater PPG</li>
        <li>--: Lost to team with greater PPG</li>
      </ul>
      {data?.data?.teams ? (
        <MatchGrid data={data.data.teams} dataParser={dataParserOutcomes} />
      ) : null}
    </div>
  );
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  const teamPoints = getTeamPoints(data);
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => (
        <MatchCell
          match={match}
          key={idx}
          renderValue={(match) => {
            const points = teamPoints[match.opponent]
              .filter(
                (opponentMatch) => opponentMatch.date < new Date(match.date)
              )
              .map((opponentPoints) => opponentPoints.points);
            return getArrayAverageFormatted(points);
          }}
        />
      )),
  ]);
}

function dataParserTeam(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  const teamPoints = getTeamPoints(data);
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => (
        <MatchCell
          match={match}
          key={idx}
          renderValue={(match) => {
            const points = teamPoints[team]
              .filter(
                (opponentMatch) => opponentMatch.date < new Date(match.date)
              )
              .map((opponentPoints) => opponentPoints.points);
            return getArrayAverageFormatted(points);
          }}
        />
      )),
  ]);
}
function dataParserOutcomes(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  const teamPoints = getTeamPoints(data);
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => (
        <MatchCell
          match={match}
          key={idx}
          renderValue={(match) => {
            const points = teamPoints[match.opponent]
              .filter(
                (opponentMatch) => opponentMatch.date < new Date(match.date)
              )
              .map((opponentPoints) => opponentPoints.points);
            const ownPoints = teamPoints[match.team]
              .filter(
                (opponentMatch) => opponentMatch.date < new Date(match.date)
              )
              .map((opponentPoints) => opponentPoints.points);
            if (!match.result) {
              return "-";
            } else if (match.result === "W") {
              return points > ownPoints ? "++" : "+";
            } else if (match.result === "L") {
              return points > ownPoints ? "-" : "--";
            } else {
              return points > ownPoints ? "//" : "/";
            }
          }}
        />
      )),
  ]);
}

function getArrayAverageFormatted(values: number[]): string {
  const average = getArrayAverage(values);
  return (Math.round(average * 100) / 100).toFixed(2);
}

function getArrayAverage(values: number[]): number {
  return values.length
    ? values.reduce((sum, curr) => sum + curr, 0) / values.length
    : 0;
}
