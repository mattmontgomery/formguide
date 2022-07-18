import BaseDataPage from "@/components/BaseDataPage";
import { getRecord, getGoals, getRecordPoints } from "@/utils/getRecord";

import {
  Conferences,
  ConferencesByYear,
  ConferenceDisplayNames,
} from "@/utils/LeagueConferences";
import { Box, Input } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { setYear, startOfYear, endOfYear, format } from "date-fns";

export default function Table() {
  return (
    <BaseDataPage
      pageTitle="Table"
      renderComponent={(data, meta) => {
        return <LeagueTable data={data} meta={meta} />;
      }}
    />
  );
}

function getRow(
  team: string,
  matches: Results.Match[],
  from?: Date,
  to?: Date
) {
  const [w, d, l] = getRecord(matches, {
    from,
    to,
  });
  const [hw, hd, hl] = getRecord(matches, {
    home: true,
    away: false,
    from,
    to,
  });
  const [aw, ad, al] = getRecord(matches, {
    home: false,
    away: true,
    from,
    to,
  });
  const [gf, ga, gd] = getGoals(matches);
  const points = getRecordPoints([w, d, l]);
  return {
    id: team,
    team: team,
    points: points,
    ppg: w + d + l > 0 ? (points / (w + d + l)).toFixed(2) : "-",
    w,
    d,
    l,
    gf,
    ga,
    gd,
    homeRecord: `${hw}-${hd}-${hl}`,
    awayRecord: `${aw}-${ad}-${al}`,
    homePoints: getRecordPoints([hw, hd, hl]),
    awayPoints: getRecordPoints([aw, ad, al]),
  };
}

function LeagueTable({
  data,
  meta,
}: {
  data: Results.ParsedData;
  meta: Results.ParsedMeta;
}): React.ReactElement {
  const [from, setFrom] = useState<Date>(
    startOfYear(setYear(new Date(), meta.year))
  );
  const [to, setTo] = useState<Date>(endOfYear(setYear(new Date(), meta.year)));
  useEffect(() => {
    setFrom(startOfYear(setYear(new Date(), meta.year)));
    setTo(endOfYear(setYear(new Date(), meta.year)));
  }, [meta.year]);
  const conferences = (ConferencesByYear[meta.league]?.[meta.year]
    ? Conferences[meta.league]
    : null) ?? ["All"];
  const teams =
    ConferencesByYear[meta.league]?.[meta.year] ??
    Object.keys(data.teams).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: "All",
      }),
      {}
    );
  const table = conferences.map((conference) => {
    return Object.keys(teams)
      ?.filter((t: string) => teams[t] === conference || conference === "All")
      .map((t) => getRow(t, data.teams[t], from, to))
      .sort((a, b) => {
        return a.points > b.points
          ? 1
          : a.points < b.points
          ? -1
          : a.w > b.w
          ? 1
          : a.w < b.w
          ? -1
          : a.gd > b.gd
          ? 1
          : a.gd < b.gd
          ? -1
          : 0;
      })
      .reverse()
      .map((record, idx) => ({
        ...record,
        rank: idx + 1,
      }));
  });
  return table && conferences ? (
    <>
      <Box m={[4, 0]}>
        From:{" "}
        <Input
          type="date"
          value={format(from, "yyyy-MM-dd")}
          onChange={(ev) => setFrom(new Date(ev.currentTarget.value))}
        />
        To:{" "}
        <Input
          type="date"
          value={format(to, "yyyy-MM-dd")}
          onChange={(ev) => setTo(new Date(ev.currentTarget.value))}
        />
      </Box>
      {conferences.map((c, idx) => {
        return (
          <Box key={idx}>
            <h3>{ConferenceDisplayNames[c]}</h3>
            <Box>
              <DataGrid
                autoHeight
                pageSize={100}
                components={{ Pagination: () => <></> }}
                columns={[
                  { field: "rank", headerName: "Rank", width: 100 },
                  { field: "id", headerName: "Team", width: 250 },
                  {
                    field: "points",
                    headerName: "Points",
                    width: 100,
                  },
                  {
                    field: "ppg",
                    headerName: "Points Per Game",
                    width: 100,
                  },
                  {
                    field: "w",
                    headerName: "W",
                    width: 100,
                  },
                  {
                    field: "d",
                    headerName: "D",
                    width: 100,
                  },
                  {
                    field: "l",
                    headerName: "L",
                    width: 100,
                  },
                  {
                    field: "gf",
                    headerName: "GF",
                    width: 100,
                  },
                  {
                    field: "ga",
                    headerName: "GA",
                    width: 100,
                  },
                  {
                    field: "gd",
                    headerName: "GD",
                    width: 100,
                  },
                  {
                    field: "homeRecord",
                    headerName: "Home",
                    width: 100,
                  },
                  {
                    field: "homePoints",
                    headerName: "Home Points",
                    width: 100,
                  },
                  {
                    field: "awayRecord",
                    headerName: "Away",
                    width: 100,
                  },
                  {
                    field: "awayPoints",
                    headerName: "Away Points",
                    width: 100,
                  },
                ]}
                rows={table[idx]}
              ></DataGrid>
            </Box>
          </Box>
        );
      })}
    </>
  ) : (
    <></>
  );
}
