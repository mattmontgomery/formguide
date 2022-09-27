import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { format, parseISO } from "date-fns";

import { useContext } from "react";
import LeagueContext from "@/components/Context/League";
import { getPastTense } from "@/utils/getMatchResultString";
import { getMLSLink } from "@/utils/getLinks";
import Link from "next/link";

export default function MatchDetails({
  match,
  onClose,
}: {
  match: Results.Match;
  onClose: () => void;
}): React.ReactElement {
  const league = useContext(LeagueContext);
  return (
    <Card
      elevation={8}
      sx={{
        position: "absolute",
        zIndex: 8,
        padding: 2,
        marginLeft: 6,
      }}
    >
      <Box sx={{ display: "flex" }}>
        {match.opponentLogo && (
          <CardMedia
            sx={{
              width: 100,
              height: 100,
              paddingLeft: 1,
            }}
            component="img"
            image={match.opponentLogo}
            alt={match.opponent}
          />
        )}
        <CardContent
          sx={{
            flex: "1 0 auto",
            width: 250,
            paddingBottom: 0,
            textAlign: "left",
          }}
        >
          <Typography
            component="div"
            variant="overline"
            sx={{ lineHeight: 1.4, paddingBottom: 1 }}
          >
            <>
              <strong>
                {match.rawDate
                  ? format(parseISO(match.rawDate), "eee., MMM d, Y")
                  : ""}
              </strong>
              <br />
              {match.rawDate
                ? format(parseISO(match.rawDate), "K:mm aaaa z")
                : ""}
            </>
          </Typography>
          <Divider />
          <Typography
            component="div"
            variant="subtitle2"
            paddingY={1}
            gutterBottom={false}
          >
            <strong>{match.home ? "Home" : "Away"}</strong> vs.{" "}
            <strong>{match.opponent}</strong>
          </Typography>
          <Divider />
          <Typography variant="subtitle1" paddingY={1}>
            <strong>
              {getPastTense(match)} {match.scoreline}{" "}
              {match.status.short === "PEN"
                ? `(PKs: ${match.score.penalty[match.home ? "home" : "away"]}–${
                    match.score.penalty[match.home ? "away" : "home"]
                  })`
                : ""}
            </strong>
          </Typography>
        </CardContent>
        <span></span>
      </Box>
      <CardActions sx={{ justifyContent: "space-between" }}>
        {league === "mls" && (
          <Button href={getMLSLink(match)} variant="outlined">
            MLS
          </Button>
        )}
        {match.fixtureId !== -1 && (
          <Link href={`/fixtures/${match.fixtureId}`} passHref>
            <Button>Fixture</Button>
          </Link>
        )}
        <Button onClick={() => onClose()}>Close</Button>
      </CardActions>
    </Card>
  );
}
