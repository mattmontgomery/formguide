import { getColumns, Row } from "@/utils/table";
import {
  DataGrid,
  DataGridProps,
  GridColDef,
  GridValidRowModel,
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
      autoHeight
      columns={columns()}
      rows={data}
      {...extraGridProps}
    ></DataGrid>
  );
}
