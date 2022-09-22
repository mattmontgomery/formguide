import useSWR from "swr";
import BasePage, { BasePageProps } from "./BasePage";
import { Box, CircularProgress } from "@mui/material";
import YearContext from "./Context/Year";
import LeagueContext from "./Context/League";
import { useContext } from "react";

export type DataPageProps<
  Data = Results.ParsedData,
  Meta = Results.ParsedMeta
> = {
  renderControls?: BasePageProps["renderControls"];
  renderComponent: (data: Data, meta: Meta) => React.ReactNode;
  pageTitle: string;
  children?: React.ReactNode;
  getEndpoint?: (year: number, league: string) => string;
  swrArgs?: unknown[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());
function BaseDataPage<Data = Results.ParsedData, Meta = Results.ParsedMeta>({
  children,
  renderControls,
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
    <BasePage pageTitle={pageTitle} renderControls={renderControls}>
      {data && data?.data ? (
        <>
          {renderComponent(data.data, data.meta)}
          {children && (
            <>
              <Box sx={{ marginTop: 2 }}>{children}</Box>
            </>
          )}
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
