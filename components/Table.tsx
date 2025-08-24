import { getColumns, type Row } from "@/utils/table";
import {
  DataGrid,
  type DataGridProps,
  type GridColDef,
  type GridValidRowModel,
} from "@mui/x-data-grid";

export default function Table<ColumnType extends GridValidRowModel = Row>({
  data,
  columns = getColumns,
  gridProps = {} as DataGridProps,
}: {
  data: ColumnType[];
  columns?: () => GridColDef<ColumnType>[];
  gridProps?: Partial<DataGridProps<ColumnType>>;
}): React.ReactElement {
  const {
    // eslint-disable-next-line
    columns: _columns,
    // eslint-disable-next-line
    rows: _rows,
    ...extraGridProps
  } = gridProps;
  return (
    <DataGrid
      autosizeOnMount
      columns={columns()}
      rows={data}
      {...extraGridProps}
    />
  );
}
