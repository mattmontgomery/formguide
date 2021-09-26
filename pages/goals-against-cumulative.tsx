import Head from "next/head";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import fetch from "unfetch";
import MatchCell from "../components/MatchCell";
import MatchGrid from "../components/MatchGrid";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function GoalsFor(): React.ReactElement {
  const { data } = useSWR<{ data: Results.ParsedData }>("/api/form", fetcher);
  return (
    <div className={styles.body}>
      <Head>
        <title>MLS Form Guide 2021</title>
      </Head>
      <h1>2021 MLS Form Guide | Goals Against | Cumulative</h1>

      {data?.data?.teams ? (
        <MatchGrid data={data.data.teams} dataParser={dataParser} />
      ) : null}
    </div>
  );
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
  const cumulativeGoals: Record<string, number[]> = {};
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => {
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
      })
      .map((match, idx) => {
        cumulativeGoals[team] = cumulativeGoals[team] || [];
        cumulativeGoals[team][idx] =
          (cumulativeGoals?.[team]?.[idx - 1] || 0) +
          (typeof match.goalsConceded === "number" ? match.goalsConceded : 0);
        return (
          <MatchCell
            match={match}
            key={idx}
            renderValue={() => cumulativeGoals[team][idx]}
          />
        );
      }),
  ]);
}
