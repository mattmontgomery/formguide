export default function Changelog(): React.ReactElement {
  return (
    <>
      <p>
        <strong>2021-09-27</strong>: Fixed bug on Expected Outcome page. Split
        PPG pages into individual pages. Refactored grid pages. Made navigation
        buttons smaller. Addded GD cumulative page.
      </p>
      <p>
        <strong>2021-09-26</strong>: Added cumulative tables. Added
        header-clicking to sort given week.
      </p>
      <p>
        <strong>2021-09-17</strong>:{" "}
        {"Fixed match link. Added PPG/Strength page. You're welcome, Trevor."}
      </p>
      <p>
        <strong>2021-09-13</strong>:{" "}
        {
          "Fixed Safari issue with date sorting. Added GD, GF, GA pages. Added options for more rolling-game charts."
        }
      </p>
    </>
  );
}
