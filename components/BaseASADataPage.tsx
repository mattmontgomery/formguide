import useSWR from "swr";
import BasePage, { BasePageProps } from "./BasePage";
import { Box, CircularProgress, Divider } from "@mui/material";
import YearContext from "./Context/Year";
import LeagueContext from "./Context/League";
import { useContext } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
function BaseASADataPage<
  T = ASA.GenericApi["data"],
  U = ASA.GenericApi["meta"]
>({
  children,
  renderControls,
  renderComponent,
  pageTitle,
  endpoint = (year, league) => `/api/asa/xg?year=${year}&league=${league}`,
}: {
  renderControls?: BasePageProps["renderControls"];
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
  return (
    <BasePage pageTitle={pageTitle} renderControls={renderControls}>
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
