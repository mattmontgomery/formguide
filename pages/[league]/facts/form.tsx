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
                  {getMostMatchesWithResult(data.teams, ["D", "L"]).map(
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
                  {getMostMatchesWithResult(data.teams, ["W", "D"]).map(
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
                  {getMostMatchesWithResult(data.teams, ["W", "L"]).map(
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

// Returns biggest streak of consecutive matches without winning
function getMostMatchesWithResult(
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
      if (resultType.includes(match.result)) {
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
