import BaseDataPage from "@/components/BaseDataPage";
import BaseGrid from "@/components/BaseGrid";
import Cell from "@/components/Cell";
import ColorKey from "@/components/ColorKey";
import { useToggle } from "@/components/Toggle/Toggle";
import {
  getMinutesColor,
  getResultBackgroundColor,
  getSmallStatsColor,
} from "@/utils/results";
import { sortByDate } from "@/utils/sort";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo } from "react";

type Options = "minutes" | "goals" | "assists" | "g+a";

export default function PlayerMinutesTeamPage(): React.ReactElement {
  const router = useRouter();
  const team = String(router.query.team);
  const { value, renderComponent } = useToggle<Options>(
    [
      {
        value: "minutes",
        label: "Minutes",
      },
      { value: "goals", label: "Goals" },
      { value: "assists", label: "Assists" },
      { value: "g+a", label: "G+A" },
    ],
    "minutes"
  );
  return (
    <BaseDataPage<FormGuideAPI.Responses.PlayerMinutesEndpoint["data"]>
      renderControls={() => (
        <>
          <Box mr={2}>{renderComponent()}</Box>
          <Box>*: On bench, did not play. -: Not on bench</Box>
        </>
      )}
      swrArgs={[team]}
      pageTitle={`${team} Player Minutes`}
      getEndpoint={(year, league) =>
        `/api/players/${league}/${team}?year=${year}`
      }
      renderComponent={(data) => team && <Data data={data} statType={value} />}
    >
      <ColorKey
        successText="> 50 minutes"
        warningText=">= 10 minutes"
        errorText="< 10 minutes"
      />
    </BaseDataPage>
  );
}

export function Data({
  data,
  statType = "minutes",
}: {
  data: FormGuideAPI.Responses.PlayerMinutesEndpoint["data"];
  statType: Options;
}) {
  const parsed = useMemo(() => {
    const players: Record<string, (number | null)[]> = {};
    data.sort(sortByDate).forEach((match, matchIdx) => {
      match.playerMinutes.forEach((player) => {
        if (typeof players[player.name] === "undefined") {
          players[player.name] = new Array(data.length).fill(null);
        }
        switch (statType) {
          case "minutes":
            players[player.name][matchIdx] = player.minutes ?? 0;
            break;
          case "goals":
            players[player.name][matchIdx] = match.goals?.filter(
              (g) => g.player.id === player.id
            ).length;
            break;
          case "assists":
            players[player.name][matchIdx] = match.goals?.filter(
              (g) => g.assist?.id === player.id
            ).length;
            break;
          case "g+a":
            players[player.name][matchIdx] = match.goals?.filter(
              (g) => g.assist?.id === player.id || g.player.id === player.id
            ).length;
            break;
        }
      });
    });
    return players;
  }, [data, statType]);
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
              ...parsedData[player].map((value, idx) => {
                return (
                  <Cell
                    getBackgroundColor={() => {
                      switch (statType) {
                        case "minutes":
                          return value
                            ? getMinutesColor(value)
                            : value === 0
                            ? getMinutesColor(0)
                            : "grey.300";
                        case "goals":
                        case "g+a":
                        case "assists":
                          return typeof value === "number"
                            ? getSmallStatsColor(value)
                            : "grey.300";
                      }
                    }}
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
