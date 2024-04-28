import ColorKey from "@/components/ColorKey";
import { useToggle } from "@/components/Toggle/Toggle";
import { sortByDate } from "@/utils/sort";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import AbstractBaseRollingPage from "@/components/Rolling/AbstractBase";
import AbstractRollingBox from "@/components/Rolling/AbstractBox";
import { isComplete } from "@/utils/match";
import { getMinutesColor, getSmallStatsColor } from "@/utils/results";
type Options = "minutes" | "goals" | "assists" | "g+a";

export default function PlayerMinutesTeamPage(): React.ReactElement {
  const router = useRouter();
  const team = String(router.query.team);
  const { value: statType, renderComponent } = useToggle<Options>(
    [
      {
        value: "minutes",
        label: "Minutes",
      },
      { value: "goals", label: "Goals" },
      { value: "assists", label: "Assists" },
      { value: "g+a", label: "G+A" },
    ],
    "minutes",
  );
  const max = statType === "minutes" ? 90 : 2;
  return (
    <AbstractBaseRollingPage<
      FormGuideAPI.Data.PlayerMinutesEndpoint,
      number,
      FormGuideAPI.Data.PlayerMinutesEndpoint[],
      Record<string, (number | undefined)[]>
    >
      filterMatches={(match) => {
        return match !== null;
      }}
      getData={(data) => {
        const players: Record<string, (number | undefined)[]> = {};
        [...data].sort(sortByDate).forEach((match, matchIdx) => {
          if (!isComplete(match.fixture)) {
            Object.keys(players).forEach((p) => {
              players[p][matchIdx] = undefined;
            });
          }
          match.playerMinutes.forEach((player) => {
            if (typeof players[player.name] === "undefined") {
              players[player.name] = new Array(data.length).fill(0);
            }
            switch (statType) {
              case "minutes":
                players[player.name][matchIdx] = player.minutes ?? 0;
                break;
              case "goals":
                players[player.name][matchIdx] =
                  match.goals?.filter((g) => g.player.id === player.id)
                    .length ?? 0;
                break;
              case "assists":
                players[player.name][matchIdx] =
                  match.goals?.filter((g) => g.assist?.id === player.id)
                    .length ?? 0;
                break;
              case "g+a":
                players[player.name][matchIdx] =
                  match.goals?.filter(
                    (g) =>
                      g.assist?.id === player.id || g.player.id === player.id,
                  ).length ?? 0;
                break;
            }
          });
        });
        return players;
      }}
      getEndpoint={(year, league) =>
        `/api/players/${league}/${team}?year=${year}`
      }
      getValue={(value) => {
        const _value = Number(value);
        return _value > 90 ? 90 : Number.isNaN(_value) ? undefined : _value;
      }}
      renderBox={(item) => {
        let backgroundColor = "success.main";

        switch (statType) {
          case "minutes":
            backgroundColor = item.value
              ? getMinutesColor(item.value)
              : item.value === 0
                ? getMinutesColor(0)
                : "grey.300";
            break;
          case "goals":
          case "g+a":
          case "assists":
            backgroundColor =
              typeof item.value === "number"
                ? getSmallStatsColor(item.value)
                : "grey.300";
            break;
        }
        console.log({ backgroundColor });
        return (
          <AbstractRollingBox
            backgroundColor={backgroundColor}
            boxHeight={
              item.value
                ? item.value >= 90
                  ? "100%"
                  : `${(item.value / max) * 100}%`
                : "0%"
            }
            value={item.value}
          />
        );
      }}
      renderControls={() => (
        <>
          <Box mr={2}>{renderComponent()}</Box>
          <Box>*: On bench, did not play. -: Not on bench</Box>
        </>
      )}
      pageTitle={`${team} Player Minutes — rolling %s-game`}
    >
      <ColorKey
        successText="> 50 minutes"
        warningText=">= 10 minutes"
        errorText="< 10 minutes"
      />
    </AbstractBaseRollingPage>
  );
}
