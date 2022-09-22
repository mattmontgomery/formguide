import { useToggle } from "./Toggle";

export type OpponentToggleOptions = "team" | "opponent";

export function useOpponentToggle(show: OpponentToggleOptions = "team") {
  return useToggle<OpponentToggleOptions>(
    [
      { value: "team", label: "Team" },
      { value: "opponent", label: "Opponent" },
    ],
    show
  );
}
