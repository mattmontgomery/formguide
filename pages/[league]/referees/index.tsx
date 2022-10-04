import BaseDataPage from "@/components/BaseDataPage";
import BaseGrid from "@/components/BaseGrid";
import Cell from "@/components/Cell";
import { MatchCellDetails } from "@/components/MatchCell";
import {
  useHomeAway,
  Options as HomeAwayOptions,
} from "@/components/Toggle/HomeAwayToggle";
import {
  RefereeStatOptions,
  useRefereeStatsToggle,
} from "@/components/Toggle/RefereeStats";
import { getRefereeFixtureData, getStatBackgroundColor } from "@/utils/referee";
import { Box } from "@mui/material";
import { useMemo } from "react";

export default function PlayerMinutesTeamPage(): React.ReactElement {
  const { value: homeAway, renderComponent: renderHomeAway } = useHomeAway();
  const { value, renderComponent } = useRefereeStatsToggle();
  return (
    <BaseDataPage<FormGuideAPI.Data.StatsEndpoint>
      renderControls={() => (
        <>
          <Box>{renderComponent()}</Box>
          <Box>{renderHomeAway()}</Box>
        </>
      )}
      pageTitle={`Referee Form`}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      renderComponent={(data) => (
        <Data data={data} statType={value} homeAway={homeAway} />
      )}
    />
  );
}

export function Data({
  data,
  homeAway,
  statType = "Yellow Cards",
}: {
  data: FormGuideAPI.Data.StatsEndpoint;
  homeAway: HomeAwayOptions;
  statType: RefereeStatOptions;
}) {
  const parsed = useMemo(() => {
    return getRefereeFixtureData(data, { statType, homeAway });
  }, [data, statType, homeAway]);
  return (
    <BaseGrid
      homeAway={"all"}
      data={parsed}
      dataParser={(parsedData) => {
        return Object.keys(parsedData)
          .sort()
          .map((player) => {
            return [
              player,
              ...parsedData[player].map(({ match, value }, idx) => {
                return (
                  <Cell
                    renderCard={(setOpen: (state: boolean) => void) => (
                      <MatchCellDetails
                        match={match}
                        onClose={() => setOpen(false)}
                        renderMatchTitle={(match) => (
                          <>
                            <strong>
                              {match.home ? match.team : match.opponent}{" "}
                              {match.home
                                ? match.goalsScored
                                : match.goalsConceded}
                            </strong>{" "}
                            –
                            <strong>
                              {!match.home
                                ? match.goalsScored
                                : match.goalsConceded}{" "}
                              {!match.home ? match.team : match.opponent}
                            </strong>
                          </>
                        )}
                        renderScoreline={() => <></>}
                      />
                    )}
                    getBackgroundColor={() =>
                      getStatBackgroundColor(statType, value, {
                        homeAway,
                      })
                    }
                    key={idx}
                  >
                    {value ? value : value === 0 ? "*" : "-"}
                  </Cell>
                );
              }),
            ];
          });
      }}
    />
  );
}
