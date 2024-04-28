import ColorKey from "@/components/ColorKey";
import BaseRollingPage from "@/components/Rolling/Base";
import { getArraySum } from "@/utils/array";

export default function Chart(): React.ReactElement {
  return (
    <BaseRollingPage
      max={5}
      getSummaryValue={getArraySum}
      pageTitle={`Rolling GA (%s game rolling)`}
      getValue={(match) => match.goalsConceded || 0}
      getBackgroundColor={({ value, periodLength }) =>
        typeof value !== "number"
          ? "background.paper"
          : value < periodLength * 1.25
            ? "success.main"
            : value < periodLength * 2
              ? "warning.main"
              : "error.main"
      }
    >
      <ColorKey
        successText="Giving up less than 1.25 goals per game"
        warningText="Giving up less than 2 goals per game"
        errorText="Giving up more than 2 goals per game"
      />
    </BaseRollingPage>
  );
}
