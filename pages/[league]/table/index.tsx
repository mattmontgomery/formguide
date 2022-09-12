import BaseDataPage from "@/components/BaseDataPage";

import {
  ConferencesByYear,
  ConferenceDisplayNames,
} from "@/utils/LeagueConferences";
import { Box, FormControlLabel, Input, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { setYear, startOfYear, endOfYear, format, addWeeks } from "date-fns";
import { getTable } from "@/utils/table";
import Table from "@/components/Table";
import { getEarliestMatch, getLatestMatch, getMatchDate } from "@/utils/data";

export default function TablePage() {
  return (
    <BaseDataPage
      pageTitle="Table"
      renderComponent={(data, meta) => {
        return <LeagueTable data={data} meta={meta} />;
      }}
    />
  );
}

function LeagueTable({
  data,
  meta,
}: {
  data: Results.ParsedData;
  meta: Results.ParsedMeta;
}): React.ReactElement {
  const [from, setFrom] = useState<Date>(
    addWeeks(getMatchDate(getEarliestMatch(data)), -1)
  );
  const [to, setTo] = useState<Date>(
    addWeeks(getMatchDate(getLatestMatch(data)), 1)
  );
  const [useConferences, setUseConferences] = useState<boolean>(
    typeof ConferencesByYear[meta.league]?.[meta.year] !== "undefined"
  );
  useEffect(() => {
    setFrom(addWeeks(getMatchDate(getEarliestMatch(data)), -1));
    setTo(addWeeks(getMatchDate(getLatestMatch(data)), 1));
  }, [data]);
  useEffect(() => {
    setUseConferences(
      typeof ConferencesByYear[meta.league]?.[meta.year] !== "undefined"
    );
  }, [meta.league, meta.year]);
  useEffect(() => {
    if (
      useConferences &&
      ConferencesByYear[meta.league]?.[meta.year] &&
      Object.keys(ConferencesByYear[meta.league]?.[meta.year] ?? {}).length !==
        Object.keys(data.teams).length
    ) {
      console.group("Table error!");
      console.warn("Some teams are missing");
      Object.keys(data.teams).forEach((team) => {
        if (!ConferencesByYear[meta.league]?.[meta.year]?.[team]) {
          console.warn(`${team} missing`);
        }
      });
      console.groupEnd();
    }
  }, [useConferences, meta, data.teams]);
  const { table, conferences } = getTable(data.teams, {
    useConferences,
    league: meta.league,
    year: meta.year,
    from,
    to,
  });
  return table ? (
    <>
      <Box m={[4, 0]}>
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
        <Box m={[4, 0]}>
          <FormControlLabel
            control={
              <Switch
                checked={useConferences}
                onChange={() => setUseConferences(!useConferences)}
              />
            }
            label="Use Conferences"
          />
        </Box>
      </Box>
      {conferences.map((c, idx) => {
        return (
          <Box key={idx}>
            <h3>{ConferenceDisplayNames[c]}</h3>
            <Box>
              <Table data={table[idx]} />
            </Box>
          </Box>
        );
      })}
    </>
  ) : (
    <></>
  );
}
