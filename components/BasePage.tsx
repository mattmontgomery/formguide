import useSWR from "swr";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import MatchGrid from "../components/MatchGrid";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function BasePage({
  dataParser,
  pageTitle,
  gridClass = styles.gridClass,
  children,
}: {
  dataParser: Results.ParserFunction;
  pageTitle: string;
  gridClass?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const { data } = useSWR<{ data: Results.ParsedData }>("/api/form", fetcher);
  return (
    <div className={styles.body}>
      <Head>
        <title>MLS Form Guide 2021</title>
      </Head>
      <h1>2021 MLS Form Guide</h1>
      {pageTitle && <h2>{pageTitle}</h2>}
      {children}
      {data?.data?.teams ? (
        <MatchGrid
          data={data.data.teams}
          dataParser={dataParser}
          gridClass={gridClass}
        />
      ) : null}
    </div>
  );
}
