import useSWR from "swr";
import BasePage from "./BasePage";
import { Box, CircularProgress, Divider } from "@mui/material";
import YearContext from "./YearContext";
import LeagueContext from "./LeagueContext";
import { useContext } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
function BaseDataPage({
  children,
  renderComponent,
  pageTitle,
}: {
  renderComponent: (data: Results.ParsedData) => React.ReactNode;
  pageTitle: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const year = useContext(YearContext);
  const league = useContext(LeagueContext);
  const { data } = useSWR<{ data: Results.ParsedData }>(
    [`/api/form?year=${year}&league=${league}`, year, league],
    fetcher
  );
  return (
    <BasePage pageTitle={pageTitle}>
      {data && data?.data ? (
        <>
          {renderComponent(data.data)}
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
