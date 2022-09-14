import useSWR from "swr";
import BasePage from "./BasePage";
import { Box, CircularProgress, Divider } from "@mui/material";
import YearContext from "./YearContext";
import LeagueContext from "./LeagueContext";
import { useContext } from "react";

export type DataPageProps<
  Data = Results.ParsedData,
  Meta = Results.ParsedMeta
> = {
  controls?: React.ReactNode;
  renderComponent: (data: Data, meta: Meta) => React.ReactNode;
  pageTitle: string;
  children?: React.ReactNode;
  getEndpoint?: (year: number, league: string) => string;
  swrArgs?: unknown[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());
function BaseDataPage<Data = Results.ParsedData, Meta = Results.ParsedMeta>({
  children,
  controls,
  renderComponent,
  pageTitle,
  getEndpoint = (year, league) => `/api/form?year=${year}&league=${league}`,
  swrArgs = [],
}: DataPageProps<Data, Meta>): React.ReactElement {
  const year = useContext(YearContext);
  const league = useContext(LeagueContext);
  const { data } = useSWR<{
    data: Data;
    meta: Meta;
  }>([getEndpoint(year, league), year, league, ...swrArgs], fetcher, {
    dedupingInterval: 500,
  });
  return (
    <BasePage pageTitle={pageTitle}>
      {data && data?.data ? (
        <>
          {controls && <Box my={2}>{controls}</Box>}
          <Divider />
          {renderComponent(data.data, data.meta)}
          <Divider />
          <Box sx={{ marginTop: 2 }}>{children}</Box>
        </>
      ) : (
        <Box
          sx={{
            paddingY: 8,
            textAlign: "center",
          }}
        >
          <CircularProgress color="success" />
        </Box>
      )}
    </BasePage>
  );
}
export default BaseDataPage;
