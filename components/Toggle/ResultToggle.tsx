import { useToggle } from "./Toggle";

export function useResultToggle() {
  return useToggle<Results.ResultTypes>(
    [{ value: "W" }, { value: "D" }, { value: "L" }],
    "W"
  );
}
