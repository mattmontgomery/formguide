import BaseDataPage from "@/components/BaseDataPage";
import BaseGrid from "@/components/BaseGrid";
import Cell from "@/components/Cell";
import { MatchCellDetails } from "@/components/MatchCell";
import { useToggle } from "@/components/Toggle/Toggle";
import { getAllUniqueFixtures } from "@/utils/getAllFixtureIds";
import { sortByDate } from "@/utils/sort";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo } from "react";

type Options = "Yellow Cards" | "Red Cards" | "Fouls";

export default function PlayerMinutesTeamPage(): React.ReactElement {
  const router = useRouter();
  const team = String(router.query.team);
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
          <Box mr={2}>{renderComponent()}</Box>
          <Box>*: On bench, did not play. -: Not on bench</Box>
        </>
      )}
      swrArgs={[team]}
      pageTitle={`Referee Form`}
      getEndpoint={(year, league) => `/api/stats/${league}?year=${year}`}
      renderComponent={(data) => team && <Data data={data} statType={value} />}
    />
  );
}

export function Data({
  data,
  statType = "Yellow Cards",
}: {
  data: FormGuideAPI.Data.StatsEndpoint;
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
      referees[refereeParsedName].push({
        match: fixture,
        value:
          Number(fixture.stats?.[fixture.team]?.[statType] ?? 0) +
          Number(fixture.stats?.[fixture.opponent]?.[statType] ?? 0),
      });
      referees[refereeParsedName].sort((a, b) => {
        return sortByDate(a.match, b.match);
      });
    });
    return referees;
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
                          return value && value > 7
                            ? "error.main"
                            : value < 3
                            ? "success.main"
                            : "warning.main";
                        case "Red Cards":
                          return value && value > 1
                            ? "error.main"
                            : value < 1
                            ? "success.main"
                            : "warning.main";
                        case "Fouls":
                          return value && value > 30
                            ? "error.main"
                            : value < 20
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
  const refereeNameParts = name?.replace(/,.+/, "").split(" ") ?? [];

  const [firstName, ...remainder] = refereeNameParts;
  if (!refereeNameParts.length) {
    return "";
  }
  return [`${firstName[0]}.`, ...remainder].join(" ");
}
