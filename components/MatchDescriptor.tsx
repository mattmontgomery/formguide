export default function MatchDescriptor({
  match,
}: {
  match: Results.Match;
}): React.ReactElement {
  return (
    <>
      {match.home ? match.team : match.opponent} {match.score.fulltime.home}-
      {match.score.fulltime.away} {match.home ? match.opponent : match.team}
    </>
  );
}
