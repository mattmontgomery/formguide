import { useRouter } from "next/router";
import { useEffect } from "react";
import { useToggle } from "./Toggle";

export type PeriodLengthOptions = 3 | 5 | 8 | 11 | number;

export function usePeriodLength(
  defaultValue: PeriodLengthOptions = 5,
  withRouter = false,
) {
  const router = useRouter();

  const toggle = useToggle<PeriodLengthOptions>(
    [
      { value: 3, label: 3 },
      { value: 5, label: 5 },
      { value: 8, label: 8 },
      { value: 11, label: 11 },
    ],
    defaultValue,
  );

  useEffect(() => {
    if (
      withRouter &&
      !Number.isNaN(Number(router.query.period)) &&
      toggle.value !== Number(router.query.period)
    ) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, period: toggle.value },
      });
    }
  }, [router, withRouter, toggle.value]);
  return toggle;
}
