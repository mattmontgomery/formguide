import BasePage from "@/components/Grid/Base";

export default function FirstHalfResults(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Halftime Results | By Match"
      getValue={(match) => match.firstHalf?.result}
    />
  );
}
