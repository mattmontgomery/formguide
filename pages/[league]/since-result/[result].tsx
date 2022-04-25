import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import { isBefore, parseISO } from "date-fns";
import { useRouter } from "next/router";

const formattedResults: Record<Results.ResultTypes, string> = {
  D: "draw",
  L: "loss",
  W: "win",
};

export default function SinceResultPage(): React.ReactElement {
  const router = useRouter();
  const result: Results.ResultTypes[] = (router.query.result
    ?.toString()
    ?.split(",") as Results.ResultTypes[]) || ["W"];
  return (
    <BaseGridPage
      pageTitle={`Games since a ${result
        .map((r) => formattedResults[r])
        .join(" or ")}`}
      dataParser={(teams) => dataParser(teams, result)}
    />
  );
}

function dataParser(
  data: Results.ParsedData["teams"],
  resultTypes: Results.ResultTypes[]
): Render.RenderReadyData {
  const lastTeamResult: Record<string, number> = {};
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))
      .map((match, idx) => {
        if (typeof lastTeamResult[team] === "undefined") {
          lastTeamResult[team] = 0;
        }
        if (
          resultTypes.filter(
            (result) => match.result?.toLowerCase() === result.toLowerCase()
          ).length > 0
        ) {
          lastTeamResult[team] = idx;
        }
        const lastResult = [...data[team]]
          .reverse()
          .find(
            (m) =>
              resultTypes.includes(m.result as Results.ResultTypes) &&
              isBefore(parseISO(m.rawDate), parseISO(match.rawDate))
          );
        const lastResultIdx = data[team].findIndex(
          (m) => m.fixtureId === lastResult?.fixtureId
        );
        return (
          <MatchCell
            match={match}
            key={idx}
            renderValue={() =>
              typeof lastTeamResult[team] !== "undefined" &&
              (match.result || data[team][idx - 1]?.result)
                ? idx - lastResultIdx - 1
                : "-"
            }
          />
        );
      }),
  ]);
}
