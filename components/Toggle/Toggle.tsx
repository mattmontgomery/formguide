import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";
import { useState } from "react";

type Option<T> = {
  value: T;
  label?: string;
};

export function useToggle<T extends string | number | boolean>(
  options: Option<T>[],
  defaultValue: T
) {
  const [value, setValue] = useState<T>(defaultValue);

  return {
    value,
    setValue,
    renderComponent: () => (
      <Toggle<T> options={options} onChange={setValue} value={value} />
    ),
  };
}

export default function Toggle<T extends string | number | boolean>({
  value,
  options = [],
  onChange,
  toggleButtonGroupProps = {},
}: {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  toggleButtonGroupProps?: Partial<ToggleButtonGroupProps>;
}) {
  return (
    <ToggleButtonGroup
      {...toggleButtonGroupProps}
      value={value}
      exclusive
      onChange={(_, value: T) => {
        onChange(value);
      }}
    >
      {options.map((opt, idx) => (
        <ToggleButton value={opt.value} key={idx}>
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
