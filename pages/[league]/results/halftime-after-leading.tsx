import BasePage from "@/components/Grid/Base";

export default function DrawingHalftimeResultsPage(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Results after Leading at Halftime | By Match"
      getValue={(match) =>
        match.firstHalf?.result === "W" && match.result ? match.result : "-"
      }
    />
  );
}
