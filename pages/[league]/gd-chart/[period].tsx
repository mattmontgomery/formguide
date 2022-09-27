import ColorKey from "@/components/ColorKey";
import BaseRollingPage from "@/components/Rolling/Base";
import { getArraySum } from "@/utils/array";

export default function Chart(): React.ReactElement {
  return (
    <BaseRollingPage
      max={5}
      getSummaryValue={getArraySum}
      pageTitle={`Rolling Gd (%s game rolling)`}
      getValue={(match) =>
        (match.goalsScored ?? 0) - (match.goalsConceded ?? 0)
      }
      getBackgroundColor={({ value }) =>
        typeof value !== "number"
          ? "background.paper"
          : value > 0
          ? "success.main"
          : value === 0
          ? "warning.main"
          : "error.main"
      }
    >
      <ColorKey
        successText="> 0 GD per game"
        warningText="0 GD per game"
        errorText="< 0 GD per game"
      />
    </BaseRollingPage>
  );
}
