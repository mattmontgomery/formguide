import BaseDataPage from "@/components/BaseDataPage";

import {
  ConferencesByYear,
  ConferenceDisplayNames,
} from "@/utils/LeagueConferences";
import { Box, FormControlLabel, Switch } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { addWeeks } from "date-fns";
import { getTable } from "@/utils/table";
import Table from "@/components/Table";
import { getEarliestMatch, getLatestMatch, getMatchDate } from "@/utils/data";
import { useDateFilter } from "@/components/DateFilter";
import LeagueContext from "@/components/Context/League";
import YearContext from "@/components/Context/Year";

export default function TablePage() {
  const league = useContext(LeagueContext);
  const year = useContext(YearContext);
  const [useConferences, setUseConferences] = useState<boolean>(
    typeof ConferencesByYear[league]?.[year] !== "undefined",
  );
  useEffect(() => {
    setUseConferences(typeof ConferencesByYear[league]?.[year] !== "undefined");
  }, [league, year]);
  return (
    <BaseDataPage
      renderControls={() => {
        return (
          <FormControlLabel
            control={
              <Switch
                checked={useConferences}
                onChange={() => setUseConferences(!useConferences)}
              />
            }
            label="Use Conferences"
          />
        );
      }}
      pageTitle="Table"
      renderComponent={(data, meta) => {
        return (
          <LeagueTable
            data={data}
            meta={meta}
            useConferences={useConferences}
          />
        );
      }}
    />
  );
}

function LeagueTable({
  data,
  meta,
  useConferences,
}: {
  data: Results.ParsedData;
  meta: Results.ParsedMeta;
  useConferences: boolean;
}): React.ReactElement {
  const { from, to, setFrom, setTo, renderComponent } = useDateFilter(
    addWeeks(getMatchDate(getEarliestMatch(data)), -1),
    addWeeks(getMatchDate(getLatestMatch(data)), 1),
  );
  useEffect(() => {
    setFrom(addWeeks(getMatchDate(getEarliestMatch(data)), -1));
    setTo(addWeeks(getMatchDate(getLatestMatch(data)), 1));
  }, [data, setFrom, setTo]);
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
      <Box m={[4, 0]}>{renderComponent()}</Box>
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
