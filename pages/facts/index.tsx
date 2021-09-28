import useSWR from "swr";
import { Box, Divider, Typography } from "@mui/material";
import { format } from "date-fns";
import BasePage from "../../components/BasePage";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function Match({ match }: { match: Results.Match }): React.ReactElement {
  return (
    <>
      {format(new Date(match.date), "Y-MM-dd")}
      {" — "}
      {match.home ? (
        <>
          <strong>{match.team}</strong> ({match.goalsScored})
        </>
      ) : (
        <>
          {match.opponent} ({match.goalsConceded})
        </>
      )}{" "}
      {!match.home ? (
        <>
          <strong>{match.team}</strong> ({match.goalsScored})
        </>
      ) : (
        <>
          {match.opponent} ({match.goalsConceded})
        </>
      )}
    </>
  );
}
export default function MatchFacts(): React.ReactElement {
  const { data } = useSWR<{ data: Results.ParsedData }>("/api/form", fetcher);
  return (
    <BasePage pageTitle="Match Facts">
      {data && (
        <>
          <Box>
            <Typography variant="h5">
              Most goals scored in a single match
            </Typography>
            <ul>
              {getMostGoalsScored(data.data.teams).map((match, idx) => (
                <li key={idx}>
                  {match.goalsScored} — <Match match={match} />
                </li>
              ))}
            </ul>
          </Box>
          <Divider />
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h5">
              Most goals conceded in a single match
            </Typography>
            <ul>
              {getMostGoalsConceded(data.data.teams).map((match, idx) => (
                <li key={idx}>
                  {match.goalsConceded} — <Match match={match} />
                </li>
              ))}
            </ul>
          </Box>
          <Divider />
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h5">Biggest GD in a match</Typography>
            <ul>
              {getBiggestGD(data.data.teams).map((match, idx) => (
                <li key={idx}>
                  {match.gd || "-"} — <Match match={match} />
                </li>
              ))}
            </ul>
          </Box>
        </>
      )}
    </BasePage>
  );
}

function getMostGoalsConceded(
  results: Results.ParsedData["teams"]
): Results.Match[] {
  return flattenMatches(results)
    .filter((match) => Boolean(match.result))
    .filter((match) => Boolean(typeof match.goalsConceded === "number"))
    .sort((a, b) => {
      return (a.goalsConceded || 0) > (b.goalsConceded || 0)
        ? 1
        : a.goalsConceded === b.goalsConceded
        ? 0
        : -1;
    })
    .reverse()
    .slice(0, 10);
}

function getBiggestGD(results: Results.ParsedData["teams"]): Results.Match[] {
  return flattenMatches(results)
    .filter((match) => Boolean(match.result))
    .filter((match) => Boolean(typeof match.goalsConceded === "number"))
    .sort((a, b) => {
      const gdA: number = typeof a.gd === "number" ? a.gd : 0;
      const gdB: number = typeof b.gd === "number" ? b.gd : 0;
      return gdA > gdB ? -1 : gdA === gdB ? 0 : 1;
    })
    .slice(0, 10);
}

function getMostGoalsScored(
  results: Results.ParsedData["teams"]
): Results.Match[] {
  return flattenMatches(results)
    .filter((match) => Boolean(match.result))
    .filter((match) => Boolean(typeof match.goalsScored === "number"))
    .sort((a, b) => {
      return (a.goalsScored || 0) > (b.goalsScored || 0)
        ? 1
        : a.goalsScored === b.goalsScored
        ? 0
        : -1;
    })
    .reverse()
    .slice(0, 10);
}

function flattenMatches(results: Results.ParsedData["teams"]): Results.Match[] {
  return Object.values(results).reduce((acc, curr) => {
    return [...acc, ...curr];
  }, []);
}
