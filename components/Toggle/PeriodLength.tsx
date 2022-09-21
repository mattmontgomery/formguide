import { useToggle } from "./Toggle";

export type PeriodLengthOptions = 3 | 5 | 8 | 11;

export function usePeriodLength(defaultValue: PeriodLengthOptions = 5) {
  return useToggle<PeriodLengthOptions>(
    [
      { value: 3, label: 3 },
      { value: 5, label: 5 },
      { value: 8, label: 8 },
      { value: 11, label: 11 },
    ],
    defaultValue
  );
}
