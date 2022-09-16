import { useToggle } from "./Toggle";

export function useResultToggle() {
  return useToggle<Results.ResultTypes>(
    [{ value: "W" }, { value: "D" }, { value: "L" }],
    "W"
  );
}
export function useResultToggleAll() {
  return useToggle<Results.ResultTypesAll>(
    [{ value: "W" }, { value: "D" }, { value: "L" }, { value: "all" }],
    "all"
  );
}
