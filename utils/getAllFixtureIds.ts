import { getMatchTitle } from "./getFormattedValues";

type Match = {
  fixtureId: number;
  title: string;
  status: Results.Fixture["status"];
  date: string;
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
