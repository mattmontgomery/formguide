import { useContext } from "react";
import { getMLSLink } from "@/utils/getLinks";
import styles from "@/styles/Home.module.css";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  SxProps,
  Typography,
} from "@mui/material";
import LeagueContext from "./Context/League";
import { getPastTense } from "@/utils/getMatchResultString";
import { format, parseISO } from "date-fns";
import Link from "next/link";

import Cell from "./Cell";
import { getResultBackgroundColor } from "@/utils/results";

export type MatchCellProps = {
  isShaded?: (match: Results.Match) => boolean;
  match: Results.Match;
  onClick?: (match: Results.Match) => void;
  renderValue?: (match: Results.Match) => React.ReactNode;
  renderRawValue?: () => number;
  prerenderedValue?: string | number;
  resultType?: "first-half" | "second-half" | "full-match";
  rightBorder?: boolean;
  shadeEmpty?: boolean;
  sx?: SxProps;
};

export default function MatchCell({
  isShaded,
  match,
  onClick,
  renderValue,
  prerenderedValue,
  resultType = "full-match",
  shadeEmpty = false,
  rightBorder = false,
}: MatchCellProps): React.ReactElement {
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
    <Cell
      getBackgroundColor={() => getResultBackgroundColor(result)}
      isShaded={() =>
        isShaded
          ? isShaded(match)
          : shadeEmpty && (!renderedValue || renderedValue === "-")
            ? true
            : false
      }
      onClick={() => onClick && onClick(match)}
      renderCard={(setOpen: (state: boolean) => void) => (
        <MatchCellDetails match={match} onClose={() => setOpen(false)} />
      )}
      rightBorder={rightBorder}
    >
      <span data-home={match.home ? "home" : null}>{renderedValue}</span>
    </Cell>
  );
}

export function MatchCellDetails<T extends Results.Match>({
  match,
  renderMatchTitle = (match) => (
    <>
      <strong>{match.home ? "Home" : "Away"}</strong> vs.{" "}
      <strong>{match.opponent}</strong>
    </>
  ),
  renderScoreline = (match) => (
    <>
      <strong>
        {getPastTense(match)} {match.scoreline}{" "}
        {match.status.short === "PEN"
          ? `(PKs: ${match.score.penalty[match.home ? "home" : "away"]}–${
              match.score.penalty[match.home ? "away" : "home"]
            })`
          : ""}
      </strong>
    </>
  ),
  onClose,
}: {
  match: T;
  renderMatchTitle?: (match: T) => React.ReactNode;
  renderScoreline?: (match: T) => React.ReactNode;
  onClose: () => void;
}): React.ReactElement {
  const league = useContext(LeagueContext);
  return (
    <Box className={styles.matchDetails}>
      <Card>
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
              {renderMatchTitle(match)}
            </Typography>
            <Divider />
            <Typography variant="subtitle1" paddingY={1}>
              {renderScoreline(match)}
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
          <Button onClick={onClose}>Close</Button>
        </CardActions>
      </Card>
    </Box>
  );
}
