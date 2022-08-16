import { format, getYear } from "date-fns";

export function getMLSLink(match: Results.Match): string {
  const home = match.home ? match.team : match.opponent;
  const away = !match.home ? match.team : match.opponent;
  const matchDate = new Date(match.date);
  const year = getYear(matchDate);
  const formattedDate = format(matchDate, "MM-dd-yyyy");
  return `https://www.mlssoccer.com/competitions/mls-regular-season/${year}/matches/${shortNamesMap[home]}vs${shortNamesMap[away]}-${formattedDate}`;
}

const shortNamesMap: Record<string, string> = {
  "Atlanta United FC": "atl",
  Austin: "aus",
  "Austin FC": "aus",
  Charlotte: "cha",
  "Charlotte FC": "cha",
  "Chicago Fire": "chi",
  "Colorado Rapids": "col",
  "Columbus Crew": "clb",
  "DC United": "dc",
  "FC Cincinnati": "cin",
  "FC Dallas": "dal",
  "Houston Dynamo": "hou",
  "Houston Dynamo FC": "hou",
  "Inter Miami": "mia",
  "Inter Miami CF": "mia",
  "Los Angeles FC": "lafc",
  "Los Angeles Galaxy": "la",
  "LA Galaxy": "la",
  "Miami United": "mia",
  "Minnesota United FC": "min",
  "Montreal Impact": "mtl",
  "Nashville SC": "nsh",
  "New England Revolution": "ne",
  "New York City FC": "nyc",
  "New York Red Bulls": "rbny",
  "Orlando City SC": "orl",
  "Philadelphia Union": "phi",
  "Portland Timbers": "por",
  "Portland Timbers FC": "por",
  "Real Salt Lake": "rsl",
  "San Jose Earthquakes": "sj",
  "Seattle Sounders": "sea",
  "Seattle Sounders FC": "sea",
  "Sporting Kansas City": "skc",
  "Toronto FC": "tor",
  "Vancouver Whitecaps": "van",
  "Vancouver Whitecaps FC": "van",
};
