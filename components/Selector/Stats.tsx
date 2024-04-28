import { MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { stats, ValidStats } from "../Stats";

export function useStatsToggle({
  selected = [],
  routerField = "type",
}: {
  selected: ValidStats[];
  routerField?: string;
}) {
  const [statTypes, setStatTypes] = useState<ValidStats[]>(selected);
  const router = useRouter();
  useEffect(() => {
    if (router.query[routerField] !== statTypes.join(",")) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, [routerField]: statTypes.join(",") },
      });
    }
  }, [router, routerField, statTypes]);
  const renderComponent = useCallback(
    () => (
      <Select
        multiple
        value={statTypes}
        onChange={(ev) => {
          if (statTypes.length === 2) {
            setStatTypes(ev.target.value.slice(1) as ValidStats[]);
          } else {
            setStatTypes(ev.target.value as ValidStats[]);
          }
        }}
      >
        {Object.entries(stats).map(([stat, statType]) => {
          return (
            <MenuItem
              key={stat}
              value={stat}
              selected={statTypes.includes(stat as ValidStats)}
            >
              {statType}
            </MenuItem>
          );
        })}
      </Select>
    ),
    [statTypes],
  );
  return {
    value: statTypes,
    renderComponent,
  };
}
