import { useToggle } from "./Toggle";

export type RefereeStatOptions = "Yellow Cards" | "Red Cards" | "Fouls";

export function useRefereeStatsToggle(
  show: RefereeStatOptions = "Yellow Cards"
) {
  return useToggle<RefereeStatOptions>(
    [
      {
        value: "Yellow Cards",
        label: "Yellow Cards",
      },
      {
        value: "Red Cards",
        label: "Red Cards",
      },
      {
        value: "Fouls",
        label: "Fouls",
      },
    ],
    show
  );
}
