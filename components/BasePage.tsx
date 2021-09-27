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
        <title>MLS Form Guide 2021 | {pageTitle}</title>
      </Head>
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
