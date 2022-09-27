import BasePage from "@/components/Grid/Base";

export default function DrawingHalftimeResultsPage(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Second-Half results, independent of first half"
      getValue={(match) => match.secondHalf?.result ?? "-"}
    />
  );
}
