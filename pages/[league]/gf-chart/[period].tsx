import ColorKey from "@/components/ColorKey";
import BaseRollingPage from "@/components/Rolling/Base";
import { getArraySum } from "@/utils/array";

export default function Chart(): React.ReactElement {
  return (
    <BaseRollingPage
      max={5}
      getSummaryValue={getArraySum}
      pageTitle={`Rolling GF (%s game rolling)`}
      getValue={(match) => match.goalsScored || 0}
      getBackgroundColor={({ value, periodLength }) =>
        typeof value !== "number"
          ? "background.paper"
          : value >= periodLength * 2
            ? "success.main"
            : value >= periodLength
              ? "warning.main"
              : "error.main"
      }
    >
      <ColorKey
        successText="Scoring more than 2 goals per game"
        warningText="Scoring more than 1 goal per game"
        errorText="Scoring less than than 1 goal per game"
      />
    </BaseRollingPage>
  );
}
