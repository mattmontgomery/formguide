import { Suspense } from "react";
import { CircularProgress } from "@mui/material";
import { Metadata } from "next";
import BasePage from "@/components/Grid/Base";
import { LeagueOptions } from "@/utils/Leagues";

type Props = {
  params: Promise<{ league: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { league } = await params;
  const leagueName = LeagueOptions[league as Results.Leagues] || league;

  return {
    title: `${leagueName} Form Guide - Soccer Form Analysis`,
    description: `Analyze ${leagueName} team form and performance statistics`,
  };
}

export default async function LeaguePage({ params }: Props) {
  // This makes the component async and suitable for server-side rendering
  const { league } = await params;
  await new Promise((resolve) => setTimeout(resolve, 0)); // Minimal async operation

  return (
    <Suspense fallback={<CircularProgress />}>
      <BasePage
        pageTitle={`Form Guide - ${LeagueOptions[league as Results.Leagues] || league}`}
        getValue={(match) => match.result ?? "-"}
      />
    </Suspense>
  );
}