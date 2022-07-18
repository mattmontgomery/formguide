const Conferences: Partial<Record<Results.Leagues, string[]>> = {
  mls: ["west", "east"],
};
const ConferencesByYear: Partial<
  Record<Results.Leagues, Record<number, Record<string, string>>>
> = {
  mls: {
    2022: {
      "Atlanta United FC": "east",
      Austin: "west",
      "Chicago Fire": "east",
      "Colorado Rapids": "west",
      "Columbus Crew": "east",
      "DC United": "east",
      "FC Cincinnati": "west",
      "FC Dallas": "west",
      "Houston Dynamo": "west",
      "Inter Miami": "east",
      "Los Angeles FC": "west",
      "Los Angeles Galaxy": "west",
      "Minnesota United FC": "min",
      "Montreal Impact": "east",
      "Nashville SC": "west",
      "New England Revolution": "east",
      "New York City FC": "east",
      "New York Red Bulls": "east",
      "Orlando City SC": "east",
      "Philadelphia Union": "east",
      "Real Salt Lake": "west",
      "Portland Timbers": "west",
      "San Jose Earthquakes": "west",
      "Seattle Sounders": "west",
      "Sporting Kansas City": "west",
      "Toronto FC": "east",
      "Vancouver Whitecaps": "west",
    },
  },
};

const ConferenceDisplayNames: Record<string, string> = {
  west: "Western Conference",
  east: "Eastern Conference",
};

const LeagueSorts: Partial<
  Record<
    Results.Leagues,
    (
      a: { points: number; w: number; gd: number },
      b: { points: number; w: number; gd: number }
    ) => 1 | 0 | -1
  >
> = {
  mls: (a, b): 1 | 0 | -1 => {
    return a.points > b.points
      ? 1
      : a.points < b.points
      ? -1
      : a.w > b.w
      ? 1
      : a.w < b.w
      ? -1
      : a.gd > b.gd
      ? 1
      : a.gd < b.gd
      ? -1
      : 0;
  },
};

const DefaultLeagueSort = (
  a: { points: number; w: number; gd: number },
  b: { points: number; w: number; gd: number }
): 1 | 0 | -1 => {
  return a.points > b.points
    ? 1
    : a.points < b.points
    ? -1
    : a.gd > b.gd
    ? 1
    : a.gd < b.gd
    ? -1
    : a.w > b.w
    ? 1
    : a.w < b.w
    ? -1
    : 0;
};

export {
  Conferences,
  ConferencesByYear,
  ConferenceDisplayNames,
  LeagueSorts,
  DefaultLeagueSort,
};
