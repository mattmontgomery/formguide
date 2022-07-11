import BaseDataPage from "@/components/BaseDataPage";
import { getRecord, getRecordPoints, RecordPoints } from "@/utils/getRecord";
import { Button, FormLabel } from "@mui/material";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";

type Records = [string, RecordPoints, number, Results.Match[]];

export default function RecordSinceDate(): React.ReactElement {
  const [sort, setSort] = useState<
    "points" | "alpha" | "matches" | "pointsMatches" | "pointsDropped"
  >("points");
  const router = useRouter();
  const { result } = router.query as { result: "w" | "d" | "l" };
  const readableResult = useMemo(() => {
    const map = { w: "leading", d: "drawing", l: "losing" };
    return map[result] ?? "unknown";
  }, [result]);
  const matchFilter = useMemo(() => {
    if (result === "w") {
      return (match: Results.Match) =>
        match.home
          ? match.score.halftime.home > match.score.halftime.away
          : match.score.halftime.away > match.score.halftime.home;
    } else if (result === "d") {
      return (match: Results.Match) =>
        match.score.halftime.home === match.score.halftime.away;
    } else {
      return (match: Results.Match) =>
        match.home
          ? match.score.halftime.home < match.score.halftime.away
          : match.score.halftime.away < match.score.halftime.home;
    }
  }, [result]);
  return (
    <BaseDataPage
      pageTitle={`Points earned when ${readableResult} at halftime`}
      renderComponent={(data) => {
        const records = Object.keys(data.teams).map((team): Records => {
          const matches = data.teams[team].filter(matchFilter);
          const record = getRecord(matches);
          return [team, record, getRecordPoints(record), matches];
        });
        return (
          <ul>
            {records
              .sort(
                sort === "points"
                  ? (a, b) => {
                      return a[2] < b[2] ? 1 : a[2] > b[2] ? -1 : 0;
                    }
                  : sort === "matches"
                  ? (a: Records, b: Records) => {
                      return a[3].length < b[3].length
                        ? 1
                        : a[3].length > b[3].length
                        ? -1
                        : 0;
                    }
                  : sort === "pointsMatches"
                  ? (a: Records, b: Records) => {
                      return a[2] / a[3].length < b[2] / b[3].length
                        ? 1
                        : a[2] / a[3].length > b[2] / b[3].length
                        ? -1
                        : 0;
                    }
                  : sort === "pointsDropped"
                  ? (a: Records, b: Records) => {
                      return a[3].length * 3 - a[2] < b[3].length * 3 - b[2]
                        ? 1
                        : a[3].length * 3 - a[2] > b[3].length * 3 - b[2]
                        ? -1
                        : 0;
                    }
                  : undefined
              )
              .map(([team, record, points, matches]: Records, idx) => {
                return (
                  <li key={idx}>
                    <strong>{team}</strong> {record[0]}–{record[1]}–{record[2]}
                    <br />({points} pts., {matches.length} matches,{" "}
                    {matches.length * 3 - points} pts. dropped)
                  </li>
                );
              })}
          </ul>
        );
      }}
    >
      <div>
        <FormLabel>Sort</FormLabel>
        <Button onClick={() => setSort("alpha")}>A-Z</Button>
        <Button onClick={() => setSort("points")}>Points</Button>
        <Button onClick={() => setSort("matches")}>Matches</Button>
        <Button onClick={() => setSort("pointsMatches")}>PPM</Button>
        <Button onClick={() => setSort("pointsDropped")}>Points Dropped</Button>
      </div>
    </BaseDataPage>
  );
}
