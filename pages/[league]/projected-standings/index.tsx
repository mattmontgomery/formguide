import BaseDataPage from "@/components/BaseDataPage";
import LeagueContext from "@/components/LeagueContext";
import YearContext from "@/components/YearContext";
import {
  ConferenceDisplayNames,
  Conferences,
  ConferencesByYear,
} from "@/utils/LeagueConferences";
import { LeagueProbabilities } from "@/utils/Leagues";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useContext } from "react";

const fieldDefinition: Omit<GridColDef, "field"> = {
  type: "number",
  valueFormatter: (n) =>
    !n.value ? "" : `${(Number(n.value) * 100).toFixed(2)}%`,
  sortComparator: (v1, v2) => {
    if (!v1) {
      return -1;
    }
    if (!v2) {
      return 1;
    }
    if (v1 > v2) {
      return 1;
    }
    if (v2 > v1) {
      return -1;
    }
    return 0;
  },
};

export default function ProjectedStandingsPage(): React.ReactElement {
  const league = useContext(LeagueContext);
  const year = useContext(YearContext);
  const conferences = Conferences[league] ?? ["All"];
  const { homeWin = 0.4, awayWin = 0.3 } = LeagueProbabilities[league] ?? {};
  return (
    <BaseDataPage<FormGuideAPI.Data.Simulations, FormGuideAPI.Meta.Simulations>
      pageTitle="League final standings simulations"
      getEndpoint={(year, league) =>
        `/api/projected-standings?league=${league}&year=${year}`
      }
      renderComponent={(data, meta) => {
        const preparedData = Object.entries(data).map(([team, results]) => {
          return {
            id: team,
            ...Object.entries(results).reduce((acc, [rank, value]) => {
              return { ...acc, [rank]: value / meta.simulations };
            }, {}),
          };
        });
        return (
          <>
            <Box>
              <Typography variant="overline">
                Simulations: {Number(meta.simulations).toLocaleString()} (number
                of simulations increases as number of games already played
                increases)
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">
                Home win odds: {homeWin}, away win odds: {awayWin}, draw odds:{" "}
                {Number(1 - homeWin - awayWin).toPrecision(2)}
              </Typography>
            </Box>

            {conferences.map((conference, idx) => {
              return (
                <Box key={idx} sx={{ paddingY: 4 }}>
                  <Typography variant="h5">
                    {ConferenceDisplayNames[conference] ?? conference}
                  </Typography>
                  <DataGrid
                    initialState={{
                      sorting: {
                        sortModel: [
                          { field: "1", sort: "desc" },
                          { field: "2", sort: "desc" },
                          { field: "3", sort: "desc" },
                          { field: "4", sort: "desc" },
                          { field: "5", sort: "desc" },
                          { field: "6", sort: "desc" },
                          { field: "7", sort: "desc" },
                          { field: "8", sort: "desc" },
                          { field: "9", sort: "desc" },
                          { field: "10", sort: "desc" },
                          { field: "11", sort: "desc" },
                          { field: "12", sort: "desc" },
                          { field: "13", sort: "desc" },
                          { field: "14", sort: "desc" },
                        ],
                      },
                    }}
                    autoHeight
                    pageSize={100}
                    columns={[
                      { field: "id", headerName: "Team", width: 250 },
                      { field: "1", ...fieldDefinition },
                      { field: "2", ...fieldDefinition },
                      { field: "3", ...fieldDefinition },
                      { field: "4", ...fieldDefinition },
                      { field: "5", ...fieldDefinition },
                      { field: "6", ...fieldDefinition },
                      { field: "7", ...fieldDefinition },
                      { field: "8", ...fieldDefinition },
                      { field: "9", ...fieldDefinition },
                      { field: "10", ...fieldDefinition },
                      { field: "11", ...fieldDefinition },
                      { field: "12", ...fieldDefinition },
                      { field: "13", ...fieldDefinition },
                      { field: "14", ...fieldDefinition },
                    ]}
                    rows={preparedData.filter(
                      (r) =>
                        ConferencesByYear[league]?.[year]?.[r.id] ===
                          conference || conference === "All"
                    )}
                  ></DataGrid>
                </Box>
              );
            })}
          </>
        );
      }}
    ></BaseDataPage>
  );
}
