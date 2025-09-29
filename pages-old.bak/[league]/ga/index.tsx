import BasePage from "@/components/Grid/Base";

export default function GoalsAgainst(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Goals Against | By Match"
      getValue={(match) => match.goalsConceded ?? "-"}
    />
  );
}
