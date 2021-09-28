import useSWR from "swr";
import styles from "../styles/Home.module.css";
import MatchGrid from "./MatchGrid";
import BasePage from "./BasePage";
import { Box, Divider } from "@mui/material";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function BaseGridPage({
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
    <BasePage pageTitle={pageTitle}>
      {data?.data?.teams ? (
        <MatchGrid
          data={data.data.teams}
          dataParser={dataParser}
          gridClass={gridClass}
        />
      ) : null}
      {children && (
        <>
          <Divider />
          <Box sx={{ marginTop: 2 }}>{children}</Box>
        </>
      )}
    </BasePage>
  );
}
