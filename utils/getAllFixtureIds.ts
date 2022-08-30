import { getMatchTitle } from "./getFormattedValues";

type Match = {
  fixtureId: number;
  title: string;
  status: Results.Fixture["status"];
  date: string;
};
type MatchWithTeams = {
  fixtureId: number;
  title: string;
  status: Results.Fixture["status"];
  date: string;
  home: string;
  away: string;
};
export default function getAllFixtureIds(data: Results.ParsedData): Match[] {
  return Object.entries(data.teams).reduce((acc: Match[], [, matches]) => {
    return [
      ...acc,
      ...matches
        .filter(
          (match) => !acc.some(({ fixtureId }) => match.fixtureId === fixtureId)
        )
        .map((match) => ({
          fixtureId: match.fixtureId,
          date: match.rawDate,
          title: getMatchTitle(match),
          status: match.status,
        })),
    ];
  }, []);
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
            date: match.rawDate,
            title: getMatchTitle(match),
            status: match.status,
          })),
      ];
    },
    []
  );
}
