import { format, parseISO } from "date-fns";
import MatchDescriptor from "../MatchDescriptor";
import AbstractRollingBox from "./AbstractBox";

export type NumberFormat = (value: number | null) => string;

export type RollingBoxProps<T> = {
  backgroundColor: string;
  boxHeight: string;
  matches?: T[];
  numberFormat?: NumberFormat;
  value: number | null;
};

export default function RollingBoxV2<T extends Results.Match>({
  backgroundColor,
  boxHeight,
  matches = [],
  value,
  numberFormat = (value: number | null): string =>
    typeof value === "number"
      ? Number.isInteger(value)
        ? value.toString()
        : value?.toFixed(1)
      : "",
}: RollingBoxProps<T>): React.ReactElement {
  return (
    <AbstractRollingBox
      backgroundColor={backgroundColor}
      boxHeight={boxHeight}
      renderCardContent={() => (
        <ol>
          {matches.map((match, idx) => (
            <li key={idx}>
              <strong>{format(parseISO(match.rawDate), "yyy-MM-dd")}</strong>
              : <MatchDescriptor match={match} />
            </li>
          ))}
        </ol>
      )}
      numberFormat={numberFormat}
      value={value}
    />
  );
}
