import Head from "next/head";
import useSWR from "swr";
import styles from "../styles/Home.module.css";
import fetch from "unfetch";
import MatchCell from "../components/MatchCell";
import MatchGrid from "../components/MatchGrid";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function GoalDifference(): React.ReactElement {
  const { data } = useSWR<{ data: Results.ParsedData }>("/api/form", fetcher);
  return (
    <div className={styles.body}>
      <Head>
        <title>MLS Form Guide 2021</title>
      </Head>
      <h1>MLS Form Guide 2021</h1>

      {data?.data?.teams ? (
        <MatchGrid data={data.data.teams} dataParser={dataParser} />
      ) : null}
    </div>
  );
}
function dataParser(
  data: Results.ParsedData["teams"]
): Results.RenderReadyData {
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
          renderValue={(match) =>
            typeof match.gd !== "undefined" ? match.gd : "-"
          }
        />
      )),
  ]);
}
