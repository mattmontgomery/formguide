import { parseISO } from "date-fns";
import { getMatchTitle } from "./getFormattedValues";

export type SlimMatch = {
  fixtureId: number;
  title: string;
  status: Results.Fixture["status"];
  date: string;
};
export type MatchWithTeams = {
  fixtureId: number;
  title: string;
  status: Results.Fixture["status"];
  date: Date;
  home: string;
  away: string;
};
export default function getAllFixtureIds(
  data: Results.ParsedData,
  filterTeam?: string
): SlimMatch[] {
  return Object.entries(data.teams).reduce(
    (acc: SlimMatch[], [team, matches]) => {
      if (filterTeam && team !== filterTeam) {
        return acc;
      }
      return [
        ...acc,
        ...matches
          .filter(
            (match) =>
              !acc.some(({ fixtureId }) => match.fixtureId === fixtureId)
          )
          .map((match) => ({
            fixtureId: match.fixtureId,
            date: match.rawDate,
            title: getMatchTitle(match),
            status: match.status,
          })),
      ];
    },
    []
  );
}

export function getAllFixtures(
  data: Results.ParsedData,
  filter: (match: Results.Match) => boolean = () => true
): MatchWithTeams[] {
  return Object.entries(data.teams).reduce(
    (acc: MatchWithTeams[], [, matches]) => {
      return [
        ...acc,
        ...matches
          .filter(
            (match) =>
              !acc.some(({ fixtureId }) => match.fixtureId === fixtureId)
          )
          .filter(filter)
          .map((match) => ({
            fixtureId: match.fixtureId,
            home: match.home ? match.team : match.opponent,
            away: !match.home ? match.team : match.opponent,
            date: parseISO(match.rawDate),
            title: getMatchTitle(match),
            status: match.status,
          })),
      ];
    },
    []
  );
}

export function getAllUniqueFixtures<
  M extends Results.Match,
  Data extends {
    teams: Record<string, M[]>;
  }
>(data: Data): M[] {
  return Object.values(data.teams).reduce((acc: M[], matches) => {
    return [
      ...acc,
      ...matches.filter(
        (match) => !acc.some(({ fixtureId }) => match.fixtureId === fixtureId)
      ),
    ];
  }, []);
}
