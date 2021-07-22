export function getMLSLink(match: Results.Match): string {
  const home = match.home ? match.team : match.opponent;
  const away = !match.home ? match.team : match.opponent;
  return `https://www.mlssoccer.com/competitions/mls-regular-season/2021/matches/${shortNamesMap[home]}vs${shortNamesMap[away]}-${match.date}`;
}

const shortNamesMap: Record<string, string> = {
  "Atlanta United FC": "atl",
  Austin: "aus",
  "Chicago Fire": "chi",
  "Colorado Rapids": "col",
  "Columbus Crew": "clb",
  "DC United": "dc",
  "FC Cincinnati": "cin",
  "FC Dallas": "dal",
  "Houston Dynamo": "hou",
  "Inter Miami": "mia",
  "Los Angeles FC": "lafc",
  "Los Angeles Galaxy": "la",
  "Miami United": "mia",
  "Minnesota United FC": "min",
  "Montreal Impact": "mtl",
  "Nashville SC": "nsh",
  "New England Revolution": "ne",
  "New York City FC": "nyc",
  "New York Red Bulls": "rbny",
  "Orlando City SC": "orl",
  "Philadelphia Union": "phi",
  "Real Salt Lake": "rsl",
  "Portland Timbers": "por",
  "San Jose Earthquakes": "sj",
  "Seattle Sounders": "sea",
  "Sporting Kansas City": "skc",
  "Toronto FC": "tor",
  "Vancouver Whitecaps": "van",
};
