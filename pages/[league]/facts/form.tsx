import { Box, Divider, Typography } from "@mui/material";
import BaseDataPage from "@/components/BaseDataPage";

export default function FormFacts(): React.ReactElement {
  return (
    <BaseDataPage
      pageTitle="Match Facts"
      renderComponent={(data) => {
        return (
          data && (
            <>
              <Box>
                <Typography variant="h5">
                  Most matches without winning
                </Typography>
                <ul>
                  {getMostMatchesWithoutResult(data.teams, ["W"]).map(
                    (data, idx) => (
                      <li key={idx}>
                        {data.team} - {data.matches}
                      </li>
                    ),
                  )}
                </ul>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h5">
                  Most matches without losing
                </Typography>
                <ul>
                  {getMostMatchesWithoutResult(data.teams, ["L"]).map(
                    (data, idx) => (
                      <li key={idx}>
                        {data.team} - {data.matches}
                      </li>
                    ),
                  )}
                </ul>
              </Box>
              <Divider />
              <Box>
                <Typography variant="h5">
                  Most matches without drawing
                </Typography>
                <ul>
                  {getMostMatchesWithoutResult(data.teams, ["D"]).map(
                    (data, idx) => (
                      <li key={idx}>
                        {data.team} - {data.matches}
                      </li>
                    ),
                  )}
                </ul>
              </Box>
            </>
          )
        );
      }}
    ></BaseDataPage>
  );
}

function getMostGoalsConceded(
  results: Results.ParsedData["teams"],
): Results.Match[] {
  return flattenMatches(results)
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
    .sort((a, b) => {
      const gdA: number = typeof a.gd === "number" ? a.gd : 0;
      const gdB: number = typeof b.gd === "number" ? b.gd : 0;
      return gdA > gdB ? -1 : gdA === gdB ? 0 : 1;
    })
    .slice(0, 10);
}

function getMostGoalsScored(
  results: Results.ParsedData["teams"],
): Results.Match[] {
  return flattenMatches(results)
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
  return Object.values(results)
    .reduce((acc, curr) => {
      return [...acc, ...curr];
    }, [])
    .filter((match) => Boolean(match.result))
    .filter((match) => Boolean(typeof match.goalsConceded === "number"));
}

// Returns biggest streak of consecutive matches without winning
function getMostMatchesWithoutResult(
  results: Results.ParsedData["teams"],
  resultType: Results.ResultType[],
): {
  team: keyof Results.ParsedData["teams"];
  matches: number;
}[] {
  const teams = Object.keys(results);
  return teams.map((team) => {
    const matches = results[team];
    let maxStreak = 0;
    let currentStreak = 0;

    matches.forEach((match) => {
      if (!resultType.includes(match.result)) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 0;
      }
    });

    // Check at the end of the loop
    maxStreak = Math.max(maxStreak, currentStreak);

    return { team, matches: maxStreak };
  });
}
