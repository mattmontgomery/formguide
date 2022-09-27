import BasePage from "@/components/Grid/Base";

export default function DrawingHalftimeResultsPage(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Results after Losing at Halftime | By Match"
      getValue={(match) =>
        match.firstHalf?.result === "L" && match.result ? match.result : "-"
      }
    />
  );
}
