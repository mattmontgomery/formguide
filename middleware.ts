import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import isLeagueAllowed from "./utils/isLeagueAllowed";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.searchParams.has("league") &&
    !isLeagueAllowed(String(request.nextUrl.searchParams.get("league")))
  ) {
    const url = request.nextUrl.clone();

    url.pathname = `/`;
    return NextResponse.rewrite(url);
  }
  const response = NextResponse.next();

  if (
    request.nextUrl.pathname !== "/favicon.ico" &&
    process.env.NODE_ENV !== "development"
  ) {
    console.info(
      `[${new Date().toJSON()}] ${request.method} ${
        request.nextUrl.pathname
      } status:${response.status}`,
    );
  }

  return response;
}
