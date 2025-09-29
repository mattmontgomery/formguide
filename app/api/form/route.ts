import { NextRequest, NextResponse } from "next/server";
import getExpires from "@/utils/getExpires";
import { getCurrentYear, LeagueYearOffset } from "@/utils/Leagues";

const FORM_API = process.env.FORM_API;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const league = (searchParams.get("league") as Results.Leagues) || "mls";
  const year = Number(searchParams.get("year")) || getCurrentYear(league);
  const yearOffset = LeagueYearOffset[league] ?? 0;
  const args = `year=${year + yearOffset}&league=${league}`;

  if (!FORM_API) {
    console.error({ error: "Missing environment variables" });
    return NextResponse.json(
      {
        data: {},
        errors: ["Application not properly configured"],
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${FORM_API}?${args}`);

    if (response.status !== 200) {
      throw `function response: ${response.statusText}`;
    }

    const responseBody = await response.json();

    return NextResponse.json(
      {
        ...responseBody,
        meta: { ...(responseBody.meta || {}), year, league, args },
      },
      {
        headers: {
          "Cache-Control": `s-maxage=${getExpires(year)}, stale-while-revalidate`,
        },
      }
    );
  } catch (e) {
    console.error(JSON.stringify({ error: e }));
    return NextResponse.json(
      {
        data: {},
        errors: [String(e)],
      },
      { status: 500 }
    );
  }
}