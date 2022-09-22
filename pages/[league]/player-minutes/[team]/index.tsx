import BaseDataPage from "@/components/BaseDataPage";
import BaseGrid from "@/components/BaseGrid";
import Cell from "@/components/Cell";
import { getResultBackgroundColor } from "@/utils/results";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function PlayerMinutesTeamPage(): React.ReactElement {
  const router = useRouter();
  const team = String(router.query.team);
  return (
    <BaseDataPage<FormGuideAPI.Responses.PlayerMinutesEndpoint["data"]>
      swrArgs={[team]}
      pageTitle={`${team} Player Minutes`}
      getEndpoint={(year, league) =>
        `/api/players/${league}/${team}?year=${year}`
      }
      renderComponent={(data) => team && <Data data={data} />}
    />
  );
}

export function Data({
  data,
}: {
  data: FormGuideAPI.Responses.PlayerMinutesEndpoint["data"];
}) {
  const parsed = useMemo(() => {
    const players: Record<string, (number | null)[]> = {};
    data.forEach((match, matchIdx) => {
      match.playerMinutes.forEach((player) => {
        if (typeof players[player.name] === "undefined") {
          players[player.name] = new Array(data.length).fill(0);
        }
        players[player.name][matchIdx] = player.minutes;
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
                      getResultBackgroundColor(
                        !minutes
                          ? null
                          : minutes >= 50
                          ? "W"
                          : minutes >= 10
                          ? "D"
                          : "L"
                      )
                    }
                    key={idx}
                  >
                    {minutes ?? "-"}
                  </Cell>
                );
              }),
            ];
          });
      }}
    />
  );
}
