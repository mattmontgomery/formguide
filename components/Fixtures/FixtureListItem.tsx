import { getRelativeDate } from "@/utils/getFormattedValues";
import { HourglassBottom, SportsSoccer } from "@mui/icons-material";
import {
  Box,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";

export default function FixtureListItem(
  match: Results.Match
): React.ReactElement {
  return (
    <ListItem>
      <ListItemIcon>
        {match.status.long === "Match Finished" ? (
          <SportsSoccer />
        ) : (
          <HourglassBottom />
        )}
      </ListItemIcon>
      <ListItemText>
        <Box>
          <Typography variant="overline">{getRelativeDate(match)}</Typography>
        </Box>
        <Box sx={{ alignItems: "center", display: "flex" }}>
          <Link href={`/fixtures/${match.fixtureId}`} passHref>
            <Button sx={{ marginRight: 2 }}>{"Fixture"}</Button>
          </Link>
          {match.home ? `${match.team}` : match.opponent}{" "}
          {match.scoreline || "vs."} {match.home ? match.opponent : match.team}
        </Box>
      </ListItemText>
    </ListItem>
  );
}
