import { useToggle } from "./Toggle";

export type Options = 3 | 5 | 8 | 11 | number;

export function useRolling(defaultValue: Options = 5) {
  return useToggle<Options>(
    [
      { value: 3, label: "3-game" },
      { value: 5, label: "5-game" },
      { value: 8, label: "8-game" },
      { value: 11, label: "11-game" },
    ],
    defaultValue,
  );
}
