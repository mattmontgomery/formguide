import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { Metadata } from "next";
import BaseDataPage from "@/components/BaseDataPage";
import { List, Typography } from "@mui/material";
import { isComplete } from "@/utils/match";
import { sortByDate } from "@/utils/sort";
import FixtureListItem from "@/components/Fixtures/FixtureListItem";
import { LeagueOptions } from "@/utils/Leagues";

type Props = {
  params: Promise<{ league: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { league } = await params;
  const leagueName = LeagueOptions[league as Results.Leagues] || league;

  return {
    title: `${leagueName} Fixtures - Upcoming Matches`,
    description: `View upcoming fixtures and matches for ${leagueName}`,
  };
}

export default async function FixturesPage({ params }: Props) {
  const { league } = await params;
  await new Promise((resolve) => setTimeout(resolve, 0)); // Minimal async operation for RSC
  const leagueName = LeagueOptions[league as Results.Leagues] || league;

  return (
    <Suspense fallback={<CircularProgress />}>
      <BaseDataPage
        pageTitle={`${leagueName} - Upcoming fixtures`}
        renderComponent={(data) => {
          const fixtures: Results.Match[] = Object.values(data.teams)
            .reduce((acc: Results.Match[], matches) => {
              return [
                ...acc,
                ...matches
                  .filter((match) => !isComplete(match))
                  .filter((match) => {
                    return !acc.some((m) => m.fixtureId === match.fixtureId);
                  }),
              ].sort(sortByDate);
            }, [])
            .slice(0, 50);

          return (
            <List>
              {fixtures.length === 0 && (
                <Typography variant="h4">No unfinished matches</Typography>
              )}
              {fixtures.map((match, idx) => (
                <FixtureListItem {...match} key={idx} />
              ))}
            </List>
          );
        }}
      />
    </Suspense>
  );
}