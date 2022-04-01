const CHANGELOG_ENTRIES: { date: string; changelog: React.ReactNode }[] = [
  {
    date: "2022-04-01",
    changelog: (
      <>Refactored data fetching, added NWSL, MLS Next Pro, USL leagues</>
    ),
  },
  {
    date: "2022-03-07",
    changelog: <>Package updates, add 2022</>,
  },
  {
    date: "2021-10-26",
    changelog: <>Upgrades to Next.js 12</>,
  },
  {
    date: "2021-10-18",
    changelog: (
      <>Adds projected points total through end of season (Projected/PPG page</>
    ),
  },
  {
    date: "2021-10-16",
    changelog: <>Adds team highlighting</>,
  },
  {
    date: "2021-10-12",
    changelog: <>Adds cumulative points, points off top pages</>,
  },
  {
    date: "2021-10-02",
    changelog: <>Adds Days Between Games page</>,
  },
  {
    date: "2021-10-02",
    changelog: <>Adds home/away highlighting on matchday-specific pages</>,
  },
  {
    date: "2021-09-30",
    changelog: <>Updates year selector styling</>,
  },
  {
    date: "2021-09-29",
    changelog: (
      <>
        Adds year selector (valid for 2012–present). Refactors pages to support
        year context.
      </>
    ),
  },
  {
    date: "2021-09-28",
    changelog: <>Adds PPG differential grid</>,
  },
  {
    date: "2021-09-28",
    changelog: <>Adds GF, GA rolling charts.</>,
  },
  {
    date: "2021-09-28",
    changelog: <>Adds Match Facts page. Refactors base page. Updates styles.</>,
  },
  {
    date: "2021-09-28",
    changelog: (
      <>
        Adds first/second half grids. Adds &lsquo;shade when empty&rsquo; option
        for match grids, seen in when leading at half/when losing at half.
        Refactors navigation for easier maintenance. Adds when
        leading/losing/drawing @ half charts.
      </>
    ),
  },
  {
    date: "2021-09-28",
    changelog: (
      <>
        Adjusts paths for ease of use and organization, splits out Nav into
        separate component.
      </>
    ),
  },
  {
    date: "2021-09-27",
    changelog: (
      <>
        Restores links to PPG/strength of schedule pages. Adds rolling GD
        charts. Updates styling for success, error. Makes rolling form chart
        slightly easier to read.
      </>
    ),
  },
  {
    date: "2021-09-26",
    changelog: <>Adds support for dark mode, adds drawer for navigation</>,
  },
  {
    date: "2021-09-26",
    changelog: (
      <>
        Fixed bug on Expected Outcome page. Split PPG pages into individual
        pages. Refactored grid pages. Made navigation buttons smaller. Addded GD
        cumulative page. Refactored top nav links.
      </>
    ),
  },
  {
    date: "2021-09-25",
    changelog: (
      <>Added cumulative tables. Added header-clicking to sort given week.</>
    ),
  },
  {
    date: "2021-09-17",
    changelog: (
      <>
        Fixed match link. Added PPG/Strength page. You{"'"}re welcome, Trevor.
      </>
    ),
  },
  {
    date: "2021-09-13",
    changelog: (
      <>
        Fixed Safari issue with date sorting. Added GD, GF, GA pages. Added
        options for more rolling-game charts.
      </>
    ),
  },
];

export default function Changelog(): React.ReactElement {
  return (
    <>
      {CHANGELOG_ENTRIES.map(({ date, changelog }, idx) => (
        <p key={idx}>
          <strong>{date}: </strong>
          {changelog}
        </p>
      ))}
    </>
  );
}
