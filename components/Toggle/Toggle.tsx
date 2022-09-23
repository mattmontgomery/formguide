import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from "@mui/material";
import { useState } from "react";

type Option<T> = {
  value: T;
  label?: string | number;
};

type OptionTypes = string | number | boolean;

export function useToggle<T extends string | number | boolean>(
  options: Option<T>[],
  defaultValue: T,
  {
    exclusive = true,
    allowEmpty = false,
  }: { exclusive?: boolean; allowEmpty?: boolean } = {}
) {
  const [value, setValue] = useState<T>(defaultValue);

  return {
    value,
    setValue,
    renderComponent: () => (
      <Toggle<T>
        options={options}
        onChange={setValue}
        value={value}
        exclusive={exclusive}
        allowEmpty={allowEmpty}
      />
    ),
  };
}

export default function Toggle<T extends OptionTypes>({
  value,
  options = [],
  exclusive = true,
  onChange,
  toggleButtonGroupProps = {},
  allowEmpty = false,
}: {
  value: T | T[];
  options: Option<T>[];
  exclusive: boolean;
  onChange: (value: T) => void;
  toggleButtonGroupProps?: Partial<ToggleButtonGroupProps>;
  allowEmpty: boolean;
}) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive={exclusive}
      onChange={(_, value: T) => {
        console.log({ allowEmpty, value });
        if (allowEmpty || value !== null) onChange(value);
      }}
      {...toggleButtonGroupProps}
    >
      {options.map((opt, idx) => (
        <ToggleButton
          color="secondary"
          value={opt.value}
          key={idx}
          sx={{ backgroundColor: "paper.primary" }}
        >
          {opt.label ?? opt.value}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
