import Link from "next/link";
import BaseDataPage from "@/components/BaseDataPage";
import { List, Typography } from "@mui/material";
import { isComplete } from "@/utils/match";
import { sortByDate } from "@/utils/sort";
import FixtureListItem from "@/components/Fixtures/FixtureListItem";
import { isToday, parseISO } from "date-fns";

export default function Fixtures(): React.ReactElement {
  return (
    <BaseDataPage
      pageTitle="Upcoming fixtures"
      renderComponent={(data) => {
        const fixtures: Results.Match[] = Object.values(data.teams)
          .reduce((acc: Results.Match[], matches) => {
            return [
              ...acc,
              ...matches
                .filter((match) => !isComplete(match))
                .filter((match) => isToday(parseISO(match.rawDate)))
                .filter((match) => {
                  return !acc.some((m) => m.fixtureId === match.fixtureId);
                }),
            ].sort(sortByDate);
          }, [])
          .slice(0, 50);

        return (
          <List>
            {fixtures.length === 0 && (
              <Typography variant="h4">No matches today</Typography>
            )}
            {fixtures.map((match, idx) => (
              <FixtureListItem {...match} key={idx} />
            ))}
          </List>
        );
      }}
    />
  );
}
