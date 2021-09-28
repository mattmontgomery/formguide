const CHANGELOG_ENTRIES: { date: string; changelog: React.ReactNode }[] = [
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
