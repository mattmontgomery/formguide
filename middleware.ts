import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { format } from "util";
import isLeagueAllowed from "./utils/isLeagueAllowed";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.searchParams.has("league") &&
    !isLeagueAllowed(String(request.nextUrl.searchParams.get("league")))
  ) {
    const url = request.nextUrl.clone();

    url.pathname = `/`;
    return NextResponse.rewrite(url);
  } else if (request.nextUrl.searchParams.has("league")) {
    console.log(
      "BANANANANA",
      String(request.nextUrl.searchParams.get("league"))
    );
  }
  const response = NextResponse.next();

  if (request.nextUrl.pathname !== "/favicon.ico") {
    console.info(
      format(
        `[%s] %s %s status:%s`,
        new Date().toJSON(),
        request.method,
        request.nextUrl.pathname,
        response.status
      )
    );
  }

  return response;
}
