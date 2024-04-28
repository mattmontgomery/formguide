import { getAllUniqueFixtures } from "./getAllFixtureIds";
import { sortByDate } from "./sort";

import { Options as HomeAwayOptions } from "@/components/Toggle/HomeAwayToggle";
import { RefereeStatOptions } from "@/components/Toggle/RefereeStats";

export function getRefereeFixtureData(
  data: FormGuideAPI.Data.StatsEndpoint,
  {
    homeAway,
    statType,
  }: { homeAway: HomeAwayOptions; statType: RefereeStatOptions },
): Record<
  string,
  { match: FormGuideAPI.Data.StatsMatch; value: number | null }[]
> {
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
    const oppValue = Number(fixture.stats?.[fixture.opponent]?.[statType] ?? 0);
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

export function getStatBackgroundColor(
  statType: RefereeStatOptions,
  value: number | null,
  { homeAway }: { homeAway: HomeAwayOptions },
) {
  if (!value) {
    return "background.default";
  }
  switch (statType) {
    case "Yellow Cards":
    default:
      return value && value >= (homeAway === "all" ? 7 : 3.5)
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
      return value && value >= (homeAway === "all" ? 30 : 15)
        ? "error.main"
        : value <= (homeAway === "all" ? 20 : 10)
          ? "success.main"
          : "warning.main";
  }
}
