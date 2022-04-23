import BaseDataPage from "@/components/BaseDataPage";
import { getFormattedTime } from "@/utils/getFormattedValues";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { HourglassBottom, SportsSoccer } from "@mui/icons-material";
import { isToday, parseISO } from "date-fns";

export default function Fixtures(): React.ReactElement {
  return (
    <BaseDataPage
      pageTitle="Today's fixtures"
      renderComponent={(data) => {
        const fixtures: Record<number, Results.Match> = {};
        Object.values(data.teams).forEach((team) =>
          team
            .filter(
              (match) =>
                typeof match.rawDate === "string" &&
                isToday(parseISO(match.rawDate))
            )
            .forEach((match) => {
              if (!fixtures[match.fixtureId]) {
                fixtures[match.fixtureId] = match;
              }
            })
        );
        return (
          <List>
            {Object.values(fixtures).length > 0 ? (
              Object.values(fixtures).map((match, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    {match.status.long === "Match Finished" ? (
                      <SportsSoccer />
                    ) : (
                      <HourglassBottom />
                    )}
                  </ListItemIcon>
                  <ListItemText>
                    <Box>
                      <Typography variant="overline">
                        {getFormattedTime(match)}
                      </Typography>
                    </Box>
                    <Box sx={{ alignItems: "center", display: "flex" }}>
                      <Button sx={{ marginRight: 2 }}>{"Fixture"}</Button>
                      {match.home ? `${match.team}` : match.opponent}{" "}
                      {match.scoreline || "vs."}{" "}
                      {match.home ? match.opponent : match.team}
                    </Box>
                  </ListItemText>
                </ListItem>
              ))
            ) : (
              <>
                <Typography variant="h5">No matches today</Typography>
              </>
            )}
          </List>
        );
      }}
    />
  );
}
