import useSWR from "swr";

import BasePage from "@/components/BasePage";
import { DataGrid } from "@mui/x-data-grid";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MLSMinutes(): React.ReactElement {
  const { data } = useSWR<PlayerStats.ApiResponse<PlayerStats.Minutes[]>>(
    `/api/player-stats/minutes`,
    fetcher
  );
  const players = data?.data;
  const teamMinutes =
    players?.reduce((acc: Record<string, PlayerStats.Minutes[]>, curr) => {
      return {
        ...acc,
        [curr.Squad]: [
          ...(acc[curr.Squad] ?? []),
          {
            ...curr,
            Min: Number(curr.Min) || 0,
          },
        ],
      };
    }, {}) ?? {};

  return (
    <BasePage pageTitle="MLS Player Stats | Minutes (as of Aug. 22, 2022)">
      <DataGrid
        components={{ Pagination: () => <></> }}
        autoHeight
        columns={[
          { field: "team", width: 250 },
          { field: "all", headerName: "All minutes" },
          { field: "90s", headerName: "90s" },
          { field: "minutes18", headerName: "<= 18" },
          { field: "minutes24", headerName: "<= 24" },
          { field: "minutes28", headerName: "<= 28" },
          { field: "minutesPlus", headerName: "> 29" },
        ]}
        rows={Object.keys(teamMinutes).map((m) => {
          return {
            id: m,
            team: m,
            all: teamMinutes[m].reduce((acc, p) => acc + p.Min, 0),
            "90s": teamMinutes[m].reduce((acc, p) => acc + Number(p["90s"]), 0),
            minutes18: teamMinutes[m]
              .filter((p) => parseAge(p.Age) < 19)
              .reduce((acc, p) => acc + p.Min, 0),
            minutes24: teamMinutes[m]
              .filter((p) => parseAge(p.Age) < 25)
              .reduce((acc, p) => acc + p.Min, 0),
            minutes28: teamMinutes[m]
              .filter((p) => parseAge(p.Age) < 29)
              .reduce((acc, p) => acc + p.Min, 0),
            minutesPlus: teamMinutes[m]
              .filter((p) => parseAge(p.Age) > 29)
              .reduce((acc, p) => acc + p.Min, 0),
          };
        })}
      ></DataGrid>
    </BasePage>
  );
}

function parseAge(age: string): number {
  const [y, d] = age.split("-");
  return Number(y) + Number(d) / 365.25;
}

function sum<T>(field: string, data: T): (acc: number, curr: T) => number {
  return (acc, curr) => {
    return 0;
  };
}
