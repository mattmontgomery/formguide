import BaseDataPage from "@/components/BaseDataPage";
import BaseGrid from "@/components/BaseGrid";
import Cell from "@/components/Cell";
import ColorKey from "@/components/ColorKey";
import { getMinutesColor, getResultBackgroundColor } from "@/utils/results";
import { sortByDate } from "@/utils/sort";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function PlayerMinutesTeamPage(): React.ReactElement {
  const router = useRouter();
  const team = String(router.query.team);
  return (
    <BaseDataPage<FormGuideAPI.Responses.PlayerMinutesEndpoint["data"]>
      renderControls={() => <>*: On bench, did not play. -: Not on bench</>}
      swrArgs={[team]}
      pageTitle={`${team} Player Minutes`}
      getEndpoint={(year, league) =>
        `/api/players/${league}/${team}?year=${year}`
      }
      renderComponent={(data) => team && <Data data={data} />}
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
}: {
  data: FormGuideAPI.Responses.PlayerMinutesEndpoint["data"];
}) {
  const parsed = useMemo(() => {
    const players: Record<string, (number | null)[]> = {};
    data.sort(sortByDate).forEach((match, matchIdx) => {
      match.playerMinutes.forEach((player) => {
        if (typeof players[player.name] === "undefined") {
          players[player.name] = new Array(data.length).fill(null);
        }
        players[player.name][matchIdx] = player.minutes ?? 0;
      });
    });
    return players;
  }, [data]);
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
              ...parsedData[player].map((minutes, idx) => {
                return (
                  <Cell
                    getBackgroundColor={() =>
                      minutes
                        ? getMinutesColor(minutes)
                        : minutes === 0
                        ? getMinutesColor(0)
                        : "grey.300"
                    }
                    key={idx}
                  >
                    {minutes ? minutes : minutes === 0 ? "*" : "-"}
                  </Cell>
                );
              }),
            ];
          });
      }}
    />
  );
}
