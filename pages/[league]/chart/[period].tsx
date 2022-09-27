import getMatchPoints from "@/utils/getMatchPoints";
import BaseRollingPage from "@/components/Rolling/Base";
import { getArraySum } from "@/utils/array";

export default function Chart(): React.ReactElement {
  return (
    <BaseRollingPage
      getBackgroundColor={({ periodLength, value }) => {
        if (value && value / (periodLength * 3) > 0.5) {
          return "success.light";
        }
        if (value && value / (periodLength * 3) > 0.25) {
          return "warning.light";
        }
        return "error.light";
      }}
      getBoxHeight={(value, periodLength) =>
        `${((value ?? 0) / (periodLength * 3)) * 100}%`
      }
      getSummaryValue={getArraySum}
      getValue={(match) => getMatchPoints(match)}
      pageTitle={`Rolling points (%s game rolling)`}
    />
  );
}
