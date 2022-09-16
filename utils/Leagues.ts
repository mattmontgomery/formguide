import { ConferenceDisplayNames } from "./LeagueConferences";

export const LeagueGames: Partial<Record<Results.Leagues, number>> = {
  epl: 38,
  mls: 34,
};

export const LeagueSeparators: Partial<Record<Results.Leagues, number[]>> = {
  mls: [34],
  ligamx: [17, 34],
};

export const LeagueOptions: Record<Results.Leagues, string> = {
  mls: "MLS",
  nwsl: "NWSL",
  mlsnp: "MLS Next Pro",
  uslc: "USL Championship",
  usl1: "USL League One",
  usl2: "USL League Two",
  nisa: "NISA",
  ligamx: "Liga MX",
  ligamx_ex: "Liga de Expansión MX",
  epl: "English Premier League",
};

export const LeagueProbabilities: Partial<
  Record<Results.Leagues, { homeWin: number; awayWin: number }>
> = {
  mls: {
    homeWin: 0.5,
    awayWin: 0.25,
  },
};

export const LeagueYearOffset: Partial<Record<Results.Leagues, number>> = {
  epl: 1,
};

export function getConferenceDisplayName(conference: string) {
  return ConferenceDisplayNames[conference] ?? conference;
}

export const TeamColors: Record<string, string[]> = {
  "Atlanta United FC": ["#80000A", "#221F1F", "#A19060"],
  Austin: ["#00B140", "#000000", "#FFFFFF"],
  "Chicago Fire": ["#FF0000", "#141946", "#7CCDEF"],
  "FC Cincinnati": ["#F05323", "#263B80"],
  "Colorado Rapids": ["#960A2C", "#9CC2EA", "#D3D5D7"],
  "Columbus Crew": ["#FEDD00", "#000000"],
  "DC United": ["#EF3E42", "#231F20"],
  "FC Dallas": ["#E81F3E", "#2A4076", "#CCCBCC"],
  "Houston Dynamo": ["#FF6B00", "#101820"],
  "Inter Miami": ["#F7B5CD", "#F7B5CD"],
  "Los Angeles Galaxy": ["#00245D", "#FFD200", "#0065A4"],
  "Los Angeles FC": ["#000000", "#C39E6D", "#E31837", "#55565A", "#B3B2B1"],
  "Minnesota United FC": ["#E4E5E6", "#8CD2F4", "#231F20"],
  "Montreal Impact": ["#0033A1", "#000000", "#9EA1A2"],
  "Nashville SC": ["#ECE83A", "#1F1646"],
  "New England Revolution": ["#0A2240", "#CE0E2D"],
  "New York City FC": ["#6CACE4", "#041E42", "#F15524"],
  "New York Red Bulls": ["#ED1E36", "#ED1E36", "#FABB23"],
  "Orlando City SC": ["#633492", "#FDE192"],
  "Philadelphia Union": ["#071B2C", "#B19B69", "#3E8EDE"],
  "Portland Timbers": ["#00482B", "#D69A00", "#EAE827", "#004812"],
  "Real Salt Lake": ["#B30838", "#013A81", "#F1CB00"],
  "San Jose Earthquakes": ["#0067B1", "#000000", "#E31837"],
  "Seattle Sounders": ["#5D9741", "#005595", "#142530"],
  "Sporting Kansas City": ["#002F65", "#91B0D5", "#999999"],
  "Toronto FC": ["#B81137", "#455560", "#B0B7BB"],
  "Vancouver Whitecaps": ["#00245E", "#9DC2EA"],
};

export function getTeamColor(team: string, variant = 0): string | null {
  return TeamColors[team]?.[variant] ?? null;
}
