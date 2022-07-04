import BaseDataPage from "@/components/BaseDataPage";
import { getRecord } from "@/utils/getRecord";
import { FormLabel, Input } from "@mui/material";
import { isAfter, parseISO } from "date-fns";
import { useRouter } from "next/router";

export default function RecordSinceDate(): React.ReactElement {
  const router = useRouter();
  const { date } = router.query;
  return date ? (
    <BaseDataPage
      pageTitle={`Record since ${date}`}
      renderComponent={(data) => {
        const parsedDate = new Date(date?.toString());
        return (
          <ul>
            {Object.keys(data.teams)
              .sort()
              .map((team, idx) => {
                const record = getRecord(
                  data.teams[team].filter((match) =>
                    isAfter(parseISO(match.rawDate), parsedDate)
                  )
                );
                return (
                  <li key={idx}>
                    <strong>{team}</strong> — {record[0]}–{record[1]}–
                    {record[2]}
                  </li>
                );
              })}
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
            router.push({
              pathname: router.basePath,
              query: { ...router.query, date: ev.target.value },
            });
          }}
        />
      </div>
    </BaseDataPage>
  ) : (
    <></>
  );
}
