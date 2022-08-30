import MatchCell from "@/components/MatchCell";
import BaseDataPage from "@/components/BaseDataPage";
import MatchGrid from "@/components/MatchGrid";
import { useState } from "react";
import { Box } from "@mui/system";
import Table from "@/components/Table";
import { getTable, sortRows } from "@/utils/table";
import { Typography } from "@mui/material";
import { getPointsForResult } from "@/utils/getMatchPoints";
import { getArraySum } from "@/utils/array";

type Projections = {
  team: string;
  fixtureId: number;
  result: Results.ResultType;
}[];

export default function Home(): React.ReactElement {
  const [points, setPoints] = useState<Projections>([]);
  return (
    <BaseDataPage
      pageTitle="Standing Projections"
      renderComponent={(data, meta) => {
        const { table, conferences } = getTable(data.teams, {
          useConferences: true,
          league: meta.league,
          year: meta.year,
        });
        return (
          <>
            <Typography variant="overline">
              Click a match and change the result. Table at the bottom of the
              page.
            </Typography>
            <Box sx={{ p: 2 }}>
              <MatchGrid
                data={data.teams}
                dataParser={(data) => dataParser(data, points)}
                getMatchCellProps={(match) => {
                  return {
                    onClick: (match) => {
                      const existing = points.findIndex((p) => {
                        return p.fixtureId === match.fixtureId;
                      });
                      if (existing > -1) {
                        setPoints([
                          ...points.slice(0, existing),
                          {
                            ...points[existing],
                            result: stepResult(points[existing].result),
                          },
                          ...points.slice(existing + 1),
                        ]);
                      } else {
                        setPoints([
                          ...points,
                          {
                            team: match.team,
                            fixtureId: match.fixtureId,
                            result: "W",
                          },
                        ]);
                      }
                    },
                    sx: {
                      ...(points.some((p) => {
                        return p.fixtureId === match.fixtureId;
                      })
                        ? {
                            boxShadow: `0 0 10px #ffc400`,
                            outline: "solid 1px",
                            outlineColor: "#ffc400",
                          }
                        : {}),
                    },
                  };
                }}
              />
            </Box>
            <Box sx={{ marginTop: 4 }}>
              {table.map((data, idx) => (
                <>
                  <Typography variant="h4">
                    Projected {conferences[idx]}
                  </Typography>
                  <Table
                    data={sortRows(
                      data.map((row) => ({
                        ...row,
                        w:
                          row.w +
                          points.filter(
                            (p) => p.team === row.team && p.result === "W"
                          ).length,
                        d:
                          row.w +
                          points.filter(
                            (p) => p.team === row.team && p.result === "D"
                          ).length,
                        l:
                          row.w +
                          points.filter(
                            (p) => p.team === row.team && p.result === "L"
                          ).length,
                        points:
                          row.points +
                          getArraySum(
                            points
                              .filter((p) => p.team === row.team)
                              .map((p) => getPointsForResult(p.result))
                          ),
                      })),
                      meta.league
                    ).map((record, idx) => ({
                      ...record,
                      rank: idx + 1,
                    }))}
                    key={idx}
                  />
                </>
              ))}
            </Box>
          </>
        );
      }}
    />
  );
}
function dataParser(
  data: Results.ParsedData["teams"],
  projections: Projections = []
): Render.RenderReadyData {
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))
      .map((match, idx) => {
        const projected = projections.find(
          (p) => p.fixtureId === match.fixtureId
        );
        return (
          <MatchCell
            match={{
              ...match,
              result: projected
                ? projected.team === match.team
                  ? projected.result
                  : getInverseResult(projected.result)
                : match.result,
            }}
            key={idx}
          />
        );
      }),
  ]);
}

function getInverseResult(result: Results.ResultType): Results.ResultType {
  return result === null
    ? null
    : result === "W"
    ? "L"
    : result === "L"
    ? "W"
    : "D";
}
function stepResult(result: Results.ResultType): Results.ResultType {
  if (result === "W") {
    return "D";
  } else if (result === "D") {
    return "L";
  } else if (result === "L") {
    return null;
  } else {
    return "W";
  }
}
