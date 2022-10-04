import BaseDataPage from "@/components/BaseDataPage";
import BaseGrid from "@/components/BaseGrid";
import Cell from "@/components/Cell";
import { MatchCellDetails } from "@/components/MatchCell";
import {
  useHomeAway,
  Options as HomeAwayOptions,
} from "@/components/Toggle/HomeAwayToggle";
import { useToggle } from "@/components/Toggle/Toggle";
import { getAllUniqueFixtures } from "@/utils/getAllFixtureIds";
import { sortByDate } from "@/utils/sort";
import { Box } from "@mui/material";
import { match } from "assert";
import { useRouter } from "next/router";
import { useMemo } from "react";

type Options = "Yellow Cards" | "Red Cards" | "Fouls";

export default function PlayerMinutesTeamPage(): React.ReactElement {
  const router = useRouter();
  const team = String(router.query.team);
  const { value: homeAway, renderComponent: renderHomeAway } = useHomeAway();
  const { value, renderComponent } = useToggle<Options>(
    [
      {
        value: "Yellow Cards",
        label: "Yellow Cards",
      },
      {
        value: "Red Cards",
        label: "Red Cards",
      },
      {
        value: "Fouls",
        label: "Fouls",
      },
    ],
    "Yellow Cards"
  );
  return (
    <BaseDataPage<FormGuideAPI.Data.StatsEndpoint>
      renderControls={() => (
        <>
          <Box>{renderComponent()}</Box>
          <Box>{renderHomeAway()}</Box>
        </>
      )}
      swrArgs={[team]}
      pageTitle={`Referee Form`}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      renderComponent={(data) =>
        team && <Data data={data} statType={value} homeAway={homeAway} />
      }
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
  statType: Options;
}) {
  const parsed = useMemo(() => {
    const referees: Record<
      string,
      { match: FormGuideAPI.Data.StatsMatch; value: number | null }[]
    > = {};
    const fixtures = getAllUniqueFixtures<
      FormGuideAPI.Data.StatsMatch,
      FormGuideAPI.Data.StatsEndpoint
    >(data);
    fixtures.forEach((fixture) => {
      const refereeParsedName = getRefereeName(fixture.referee);

      if (!refereeParsedName) {
        return;
      }
      if (typeof referees[refereeParsedName] === "undefined") {
        referees[refereeParsedName] = [];
      }
      const teamValue = Number(fixture.stats?.[fixture.team]?.[statType] ?? 0);
      const oppValue = Number(
        fixture.stats?.[fixture.opponent]?.[statType] ?? 0
      );
      referees[refereeParsedName].push({
        match: fixture,
        value:
          homeAway === "all"
            ? teamValue + oppValue
            : homeAway === "home"
            ? fixture.home
              ? teamValue
              : oppValue
            : fixture.home
            ? oppValue
            : teamValue,
      });
      referees[refereeParsedName].sort((a, b) => {
        return sortByDate(a.match, b.match);
      });
    });
    return referees;
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
                    getBackgroundColor={() => {
                      if (!value) {
                        return "background.default";
                      }
                      switch (statType) {
                        case "Yellow Cards":
                        default:
                          return value &&
                            value >= (homeAway === "all" ? 7 : 3.5)
                            ? "error.main"
                            : value <= (homeAway === "all" ? 3 : 1.5)
                            ? "success.main"
                            : "warning.main";
                        case "Red Cards":
                          return value && value >= 1
                            ? "error.main"
                            : value < 1
                            ? "success.main"
                            : "warning.main";
                        case "Fouls":
                          return value &&
                            value >= (homeAway === "all" ? 30 : 15)
                            ? "error.main"
                            : value <= (homeAway === "all" ? 20 : 10)
                            ? "success.main"
                            : "warning.main";
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

function getRefereeName(name: string): string {
  const refereeNameParts =
    name?.replace(/,.+/, "").split(" ").filter(Boolean) ?? [];

  if (!refereeNameParts.length) {
    return "";
  }

  const [firstName, ...remainder] = refereeNameParts;
  return [`${firstName[0]}.`, ...remainder].join(" ");
}
