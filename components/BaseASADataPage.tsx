import useSWR from "swr";
import BasePage from "./BasePage";
import { Box, CircularProgress, Divider } from "@mui/material";
import YearContext from "./YearContext";
import LeagueContext from "./LeagueContext";
import { useContext } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
function BaseASADataPage<
  T = ASA.GenericApi["data"],
  U = ASA.GenericApi["meta"]
>({
  children,
  renderComponent,
  pageTitle,
  endpoint = (year, league) => `/api/asa/xg?year=${year}&league=${league}`,
}: {
  renderComponent: (data: T, meta: U) => React.ReactNode;
  pageTitle: string;
  children?: React.ReactNode;
  endpoint: ASA.Endpoint;
}): React.ReactElement {
  const year = useContext(YearContext);
  const league = useContext(LeagueContext);
  const { data } = useSWR<{
    data: T;
    meta: U;
  }>([endpoint(String(year), league), year, league], fetcher);
  console.log({ data });
  return (
    <BasePage pageTitle={pageTitle}>
      {data && data?.data ? (
        <>
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
export default BaseASADataPage;
