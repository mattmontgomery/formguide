import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

export type Options = "all" | "home" | "away";
export default function HomeAwayToggle(props: {
  value: Options;
  onChange: (value: Options) => void;
}) {
  return (
    <ToggleButtonGroup
      value={props.value}
      exclusive
      onChange={(_, value) => {
        props.onChange(value ?? "all");
      }}
    >
      <ToggleButton value="all">All</ToggleButton>,
      <ToggleButton value="home">Home</ToggleButton>,
      <ToggleButton value="away">Away</ToggleButton>,
    </ToggleButtonGroup>
  );
}
export function useHomeAway(defaultValue: Options = "all") {
  const [value, setValue] = useState<Options>(defaultValue);
  const renderComponent = () => (
    <HomeAwayToggle value={value} onChange={setValue} />
  );
  return { value, setValue, renderComponent };
}
