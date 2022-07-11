import BaseDataPage from "@/components/BaseDataPage";
import { getRecord, getRecordPoints, RecordPoints } from "@/utils/getRecord";
import { Button, FormLabel, Input } from "@mui/material";
import { isAfter, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RecordSinceDate(): React.ReactElement {
  const router = useRouter();
  const { date } = router.query;
  const [sort, setSort] = useState<"points" | "alpha">("points");
  return date ? (
    <BaseDataPage
      pageTitle={`Record since ${date}`}
      renderComponent={(data) => {
        const parsedDate = new Date(date?.toString());
        const records = Object.keys(data.teams).map(
          (team): [string, RecordPoints, number] => {
            const record = getRecord(
              data.teams[team].filter((match) =>
                isAfter(parseISO(match.rawDate), parsedDate)
              )
            );
            return [team, record, getRecordPoints(record)];
          }
        );
        return (
          <ul>
            {records
              .sort(
                sort === "points"
                  ? (a, b) => {
                      return a[2] < b[2] ? 1 : a[2] > b[2] ? -1 : 0;
                    }
                  : undefined
              )
              .map(
                (
                  [team, record, points]: [string, RecordPoints, number],
                  idx
                ) => {
                  return (
                    <li key={idx}>
                      <strong>{team}</strong> ({points}) — {record[0]}–
                      {record[1]}–{record[2]}
                    </li>
                  );
                }
              )}
          </ul>
        );
      }}
    >
      <div>
        <FormLabel>Select a date</FormLabel>
        <Input
          defaultValue={date}
          type="date"
          sx={{ marginLeft: 1 }}
          onChange={(ev) => {
            if (ev.target.value) {
              router.push({
                pathname: router.basePath,
                query: { ...router.query, date: ev.target.value },
              });
            }
          }}
        />
      </div>
      <div>
        <FormLabel>Sort</FormLabel>
        <Button onClick={() => setSort("alpha")}>A-Z</Button>
        <Button onClick={() => setSort("points")}>Points</Button>
      </div>
    </BaseDataPage>
  ) : (
    <></>
  );
}
