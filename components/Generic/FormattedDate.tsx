import { format } from "date-fns";

export type FormattedDateProps = {
  date: Date;
};
export default function FormattedDate(props: FormattedDateProps) {
  return <>{format(props.date, "MMM d")}</>;
}
