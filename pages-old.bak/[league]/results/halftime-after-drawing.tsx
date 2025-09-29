import BasePage from "@/components/Grid/Base";

export default function DrawingHalftimeResultsPage(): React.ReactElement {
  return (
    <BasePage
      pageTitle="Results after Drawing at Halftime | By Match"
      getValue={(match) =>
        match.firstHalf?.result === "D" && match.result ? match.result : "-"
      }
    />
  );
}
