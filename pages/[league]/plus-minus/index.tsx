import BaseDataPage from "@/components/BaseDataPage";
import Table from "@/components/Table";
import { GridToolbar } from "@mui/x-data-grid";

export default function PlusMinusPage() {
  return (
    <BaseDataPage<Results.MatchWithGoalData>
      getEndpoint={(year, league) => `/api/plus-minus/${league}?year=${year}`}
      pageTitle="Plus-Minus"
      renderComponent={(data) => <PlusMinus data={data} />}
    />
  );
}

function PlusMinus({ data }: { data: Results.MatchWithGoalData }) {
  const rows = Object.entries(data).reduce(
    (acc: Row[], [team, players]): Row[] => {
      return [
        ...acc,
        ...(players
          ? Object.entries(players).map(
              ([player, minutes]: [
                string,
                FormGuideAPI.Data.PlusMinus,
              ]): Row => {
                return {
                  id: player,
                  player,
                  team,
                  plusMinus: minutes.onGF - minutes.onGA,
                  minutes: minutes.minutes,
                  matches: minutes.matches,
                };
              },
            )
          : []),
      ];
    },
    [],
  );
  return (
    <Table<Row>
      gridProps={{
        slots: { toolbar: GridToolbar },
      }}
      columns={() => [
        { field: "team", width: 200 },
        { field: "player", width: 200 },
        {
          field: "plusMinus",
          header: "+/-",
          valueFormatter: (a: { value: number }) =>
            a.value >= 0 ? `+${a.value}` : a.value,
        },
        {
          field: "minutes",
          valueFormatter: (a: { value: number }) =>
            Number(a.value).toLocaleString(),
        },
        { field: "matches" },
      ]}
      data={rows}
    />
  );
}

type Row = {
  id: string;
  player: string;
  team: string;
  plusMinus: number;
  minutes: number;
  matches: number;
};
