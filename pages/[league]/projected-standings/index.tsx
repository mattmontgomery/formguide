import BaseDataPage from "@/components/BaseDataPage";
import LeagueContext from "@/components/Context/League";
import { useToggle } from "@/components/Toggle/Toggle";
import YearContext from "@/components/Context/Year";
import {
  ConferenceDisplayNames,
  Conferences,
  ConferencesByYear,
} from "@/utils/LeagueConferences";
import { LeagueProbabilities } from "@/utils/Leagues";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useContext, useMemo } from "react";

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
  const { value: useTeamPpg, renderComponent: renderToggle } =
    useToggle<boolean>(
      [
        { value: true, label: "Team PPG" },
        { value: false, label: "Pre-Calculated Averages" },
      ],
      true
    );
  const getEndpoint = useMemo(() => {
    return (year: number, league: string): string =>
      `/api/projected-standings?league=${league}&year=${year}&teamPPG=${
        useTeamPpg ? 1 : 0
      }`;
  }, [useTeamPpg]);
  return (
    <BaseDataPage<FormGuideAPI.Data.Simulations, FormGuideAPI.Meta.Simulations>
      renderControls={renderToggle}
      pageTitle="League final standings simulations"
      getEndpoint={getEndpoint}
      renderComponent={(data, meta) => {
        const preparedData = Object.entries(data).map(([team, results]) => {
          return {
            id: team,
            median: Object.entries(results)
              .map(([rank, value]) => {
                return [Number(rank), value];
              })
              .sort(([, aValue], [, bValue]) => {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
              })[0][0],
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
              {!useTeamPpg && (
                <Typography variant="caption">
                  Home win odds: {homeWin}, away win odds: {awayWin}, draw odds:{" "}
                  {Number(1 - homeWin - awayWin).toPrecision(2)}
                </Typography>
              )}
              {useTeamPpg && (
                <Typography variant="caption">
                  Home win odds and away win odds are calculated with team PPG
                </Typography>
              )}
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
                        sortModel: [{ field: "median", sort: "asc" }],
                      },
                    }}
                    autoHeight
                    pageSize={100}
                    columns={[
                      { field: "id", headerName: "Team", width: 250 },
                      { field: "median", headerName: "Median", width: 100 },
                      ...Array(
                        preparedData.filter(
                          (r) =>
                            ConferencesByYear[league]?.[year]?.[r.id] ===
                              conference || conference === "All"
                        ).length
                      )
                        .fill(null)
                        .map((_, idx) => ({
                          field: String(idx + 1),
                          ...fieldDefinition,
                        })),
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
