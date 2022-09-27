import BasePage from "@/components/Grid/Base";

export default function GoalsFor(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Goals For | By Match"
      getValue={(match) => match.goalsScored ?? "-"}
    />
  );
}
