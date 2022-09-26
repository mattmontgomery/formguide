import getMatchPoints from "@/utils/getMatchPoints";
import BaseRollingPageV2 from "@/components/BaseRollingPageV2";
import { getArraySum } from "@/utils/array";

export default function Chart(): React.ReactElement {
  return (
    <BaseRollingPageV2
      getBackgroundColor={({ periodLength, value }) => {
        if (value && value / (periodLength * 3) > 0.5) {
          return "success.light";
        }
        if (value && value / (periodLength * 3) > 0.25) {
          return "warning.light";
        }
        return "error.light";
      }}
      getMax={(periodLength) => periodLength * 3}
      getSummaryValue={getArraySum}
      getValue={(match) => getMatchPoints(match)}
      isStaticHeight={false}
      pageTitle={`Rolling points (%s game rolling)`}
    />
  );
}
