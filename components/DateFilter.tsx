import { Input } from "@mui/material";
import { Box } from "@mui/system";
import { format, isValid, parseISO } from "date-fns";
import { useState } from "react";

export default function DateFilter({
  from,
  to,
  setFrom,
  setTo,
}: {
  from: Date;
  to: Date;
  setFrom: (d: Date) => void;
  setTo: (d: Date) => void;
}) {
  console.log({ from, to });
  return (
    <Box m={[4, 0]}>
      From:{" "}
      <Input
        type="date"
        value={format(from, "yyyy-MM-dd")}
        onChange={(ev) => {
          const newDate = parseISO(ev.currentTarget.value);
          if (isValid(newDate)) setFrom(newDate);
        }}
      />
      To:{" "}
      <Input
        type="date"
        value={format(to, "yyyy-MM-dd")}
        onChange={(ev) => {
          const newDate = parseISO(ev.currentTarget.value);
          if (isValid(newDate)) setTo(newDate);
        }}
      />
    </Box>
  );
}

export function useDateFilter(
  defaultFrom: Date,
  defaultTo: Date
): {
  from: Date;
  to: Date;
  setFrom: (date: Date) => void;
  setTo: (date: Date) => void;
  renderComponent: () => React.ReactNode;
} {
  const [from, setFrom] = useState<Date>(defaultFrom);
  const [to, setTo] = useState<Date>(defaultTo);
  const renderComponent = () => (
    <DateFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />
  );
  return { from, to, setFrom, setTo, renderComponent };
}
