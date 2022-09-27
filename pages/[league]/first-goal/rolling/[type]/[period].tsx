import { useRouter } from "next/router";

import { getFirstGoalConceded, getFirstGoalScored } from "@/utils/getGoals";
import BaseRollingPage from "@/components/Rolling/Base";

export default function Chart(): React.ReactElement {
  const router = useRouter();
  const { type = "gf" } = router.query;
  const goalType: "gf" | "ga" = String(type) as "gf" | "ga";
  return (
    <BaseRollingPage<Results.MatchWithGoalData>
      pageTitle={`Rolling first ${type} (%s game rolling)`}
      getEndpoint={(year, league) => `/api/goals/${league}?year=${year}`}
      getBackgroundColor={({ value }) => {
        if (goalType === "gf" && value && value > 45) {
          return "warning.light";
        }
        if (goalType === "ga" && value && value < 45) {
          return "warning.light";
        }
        return "success.light";
      }}
      getBoxHeight={(value) => `${value ? 100 - Math.round(value) : 100}%`}
      getValue={(match) =>
        goalType === "gf"
          ? getFirstGoalScored(match)?.time.elapsed
          : getFirstGoalConceded(match)?.time.elapsed
      }
    />
  );
}
