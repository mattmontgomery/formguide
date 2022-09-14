import BaseGridPage from "@/components/BaseGridPage";
import MatchCell from "@/components/MatchCell";
import { useResultToggle } from "@/components/Toggle/ResultToggle";
import { getInverseResult } from "@/utils/results";
import { isBefore, parseISO } from "date-fns";

const formattedResults: Record<Results.ResultTypes, string> = {
  D: "draw",
  L: "loss",
  W: "win",
};

export default function OpponentSinceResultPage(): React.ReactElement {
  const { value: result, renderComponent } = useResultToggle();
  return (
    <BaseGridPage
      controls={<>Result: {renderComponent()}</>}
      pageTitle={`Opponent Games since a ${formattedResults[result]} ${
        result === "W"
          ? "(Slumpbusters)"
          : result === "L"
          ? "(Streakbusters)"
          : ""
      }`}
      dataParser={(teams) => dataParser(teams, result)}
    />
  );
}

function dataParser(
  data: Results.ParsedData["teams"],
  resultType: Results.ResultTypes = "W"
): Render.RenderReadyData {
  return Object.keys(data).map((team) => [
    team,
    ...data[team]
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1))
      .map((match, idx) => {
        const lastResult = data[match.opponent]
          .filter((m) => isBefore(parseISO(m.rawDate), parseISO(match.rawDate)))
          .filter((m) => m.result)
          .reverse()
          .findIndex((m) => m.result && resultType === m.result);
        return (
          <MatchCell
            match={match}
            key={idx}
            renderValue={() => (lastResult === -1 ? "-" : lastResult)}
            isShaded={() => {
              return (
                match.result !== getInverseResult(resultType) || lastResult <= 0
              );
            }}
          />
        );
      }),
  ]);
}
