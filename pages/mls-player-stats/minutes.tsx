import useSWR from "swr";

import BasePage from "@/components/BasePage";
import { DataGrid } from "@mui/x-data-grid";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MLSMinutes(): React.ReactElement {
  const { data } = useSWR<PlayerStats.ApiResponse<PlayerStats.Minutes[]>>(
    `/api/player-stats/minutes`,
    fetcher,
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
          { field: "team", width: 250, pinnable: true },
          { field: "all", headerName: "All minutes" },
          { field: "90s", headerName: "90s" },
          { field: "minutes18", headerName: "<= 18" },
          { field: "minutes24", headerName: "<= 24" },
          { field: "minutes28", headerName: "<= 28" },
          { field: "minutes29Plus", headerName: "> 29" },
          { field: "minutes32Plus", headerName: "> 32" },
          { field: "16" },
          { field: "17" },
          { field: "18" },
          { field: "19" },
          { field: "20" },
          { field: "21" },
          { field: "22" },
          { field: "23" },
          { field: "24" },
          { field: "25" },
          { field: "26" },
          { field: "27" },
          { field: "28" },
          { field: "29" },
          { field: "30" },
          { field: "31" },
          { field: "32" },
          { field: "33" },
          { field: "34" },
        ]}
        rows={Object.keys(teamMinutes).map((m) => {
          return {
            id: m,
            team: m,
            all: teamMinutes[m].reduce((acc, p) => acc + p.Min, 0),
            "90s": teamMinutes[m].reduce((acc, p) => acc + Number(p["90s"]), 0),
            ...[
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24",
              "25",
              "26",
              "27",
              "28",
              "29",
              "30",
              "31",
              "32",
              "33",
              "34",
            ].reduce((acc: Record<string, number>, curr) => {
              return {
                ...acc,
                [curr]:
                  (acc[curr] ?? 0) +
                  teamMinutes[m]
                    .filter((p) => Math.floor(parseAge(p.Age)) === Number(curr))
                    .reduce((acc, p) => acc + p.Min, 0),
              };
            }, {}),
            minutes18: teamMinutes[m]
              .filter((p) => parseAge(p.Age) < 19)
              .reduce((acc, p) => acc + p.Min, 0),
            minutes24: teamMinutes[m]
              .filter((p) => parseAge(p.Age) < 25)
              .reduce((acc, p) => acc + p.Min, 0),
            minutes28: teamMinutes[m]
              .filter((p) => parseAge(p.Age) < 29)
              .reduce((acc, p) => acc + p.Min, 0),
            minutes29Plus: teamMinutes[m]
              .filter((p) => parseAge(p.Age) > 29)
              .reduce((acc, p) => acc + p.Min, 0),
            minutes32Plus: teamMinutes[m]
              .filter((p) => parseAge(p.Age) > 32)
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
