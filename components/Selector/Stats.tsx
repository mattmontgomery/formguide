import { MenuItem, Select } from "@mui/material";
import { useCallback, useState } from "react";
import { stats, ValidStats } from "../Stats";

export function useStatsToggle({ selected = [] }: { selected: ValidStats[] }) {
  const [statTypes, setStatTypes] = useState<ValidStats[]>(selected);
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
    [statTypes]
  );
  return {
    value: statTypes,
    renderComponent,
  };
}
