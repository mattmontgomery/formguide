import { useContext, useState } from "react";
import { getMLSLink } from "@/utils/getLinks";
import styles from "@/styles/Home.module.css";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  ClickAwayListener,
  Divider,
  Typography,
} from "@mui/material";
import LeagueContext from "./LeagueContext";
import { getPastTense } from "@/utils/getMatchResultString";
import { format, parseISO } from "date-fns";
import Link from "next/link";

export default function MatchCell({
  isShaded = () => false,
  match,
  renderValue,
  renderRawValue,
  prerenderedValue,
  resultType = "full-match",
  shadeEmpty = false,
}: {
  isShaded?: (match: Results.Match) => boolean;
  match: Results.Match;
  renderValue?: (match: Results.Match) => string | number;
  renderRawValue?: () => number;
  prerenderedValue?: string | number;
  resultType?: "first-half" | "second-half" | "full-match";
  shadeEmpty?: boolean;
}): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const result =
    resultType === "first-half"
      ? match.firstHalf?.result
      : resultType === "second-half"
      ? match.secondHalf?.result
      : match.result;
  const valueRenderer =
    typeof renderValue !== "function" ? () => result || "-" : renderValue;
  const renderedValue =
    typeof prerenderedValue !== "undefined"
      ? prerenderedValue
      : valueRenderer(match);

  return (
    <Box
      className={styles.gridRowCell}
      sx={{
        textAlign: `center`,
        fontWeight: `bold`,
        fontSize: `14px`,
        color: `background.paper`,
        borderRight: `1px solid rgb(181, 181, 181)`,
        position: `relative`,
        cursor: `pointer`,
      }}
    >
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box>
          {open ? (
            <MatchCellDetails match={match} onClose={() => setOpen(false)} />
          ) : null}
          <Box
            sx={{
              backgroundColor: !result
                ? "rgb(200, 200, 200)"
                : result === "W"
                ? "success.main"
                : result === "L"
                ? "error.main"
                : "warning.main",
              padding: "0.25rem",
              filter:
                Boolean(shadeEmpty && renderedValue === "-") || isShaded(match)
                  ? "grayscale(0.75) opacity(0.75)"
                  : "none",
            }}
            onClick={() => setOpen(true)}
          >
            <span data-home={match.home ? "home" : null}>{renderedValue}</span>
          </Box>
        </Box>
      </ClickAwayListener>
    </Box>
  );
}

function MatchCellDetails({
  match,
  onClose,
}: {
  match: Results.Match;
  onClose: () => void;
}): React.ReactElement {
  const league = useContext(LeagueContext);
  return (
    <Box className={styles.matchDetails}>
      <Card>
        <Box sx={{ display: "flex" }}>
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
          <CardContent sx={{ flex: "1 0 auto", width: 250, paddingBottom: 0 }}>
            <Typography
              component="div"
              variant="overline"
              color="text.secondary"
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
                  ? `(PKs: ${
                      match.score.penalty[match.home ? "home" : "away"]
                    }???${match.score.penalty[match.home ? "away" : "home"]})`
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
          {process.env.NEXT_PUBLIC_ALLOW_FIXTURE_PAGE && (
            <Link href={`/fixtures/${match.fixtureId}`} passHref>
              <Button>Fixture</Button>
            </Link>
          )}
          <Button onClick={onClose}>Close</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
