import BasePage from "@/components/Grid/Base";

export default function GoalDifference(): React.ReactElement {
  return (
    <BasePage
      pageTitle="GD, single team, 2H - 1H"
      getValue={(match) =>
        typeof match.firstHalf !== "undefined" &&
        typeof match.secondHalf !== "undefined"
          ? (match.secondHalf?.goalsConceded || 0) -
            (match.firstHalf?.goalsConceded || 0) -
            (match.firstHalf?.goalsConceded || 0)
          : "-"
      }
    >
      <strong>Note:</strong>
      {
        " This is not a super-meaningful chart. It lives mostly as an easy way to see teams that concede more goals in the first half than the second half (negative numbers) or the other way around (positive numbers)"
      }
    </BasePage>
  );
}
