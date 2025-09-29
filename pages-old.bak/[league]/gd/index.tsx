import BasePage from "@/components/Grid/Base";

export default function GoalDifference(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Goal Difference"
      getValue={(match) => match.gd ?? "-"}
    />
  );
}
