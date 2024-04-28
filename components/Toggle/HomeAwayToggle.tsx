import { useToggle } from "./Toggle";

export type Options = "all" | "home" | "away";

export function useHomeAway(defaultValue: Options = "all") {
  return useToggle<Options>(
    [
      { value: "all", label: "All" },
      { value: "home", label: "Home" },
      { value: "away", label: "Away" },
    ],
    defaultValue,
  );
}
