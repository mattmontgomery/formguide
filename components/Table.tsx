import { getColumns, Row } from "@/utils/table";
import {
  DataGrid,
  DataGridProps,
  GridColumns,
  GridValidRowModel,
} from "@mui/x-data-grid";

export default function Table<ColumnType extends GridValidRowModel = Row>({
  data,
  columns = getColumns,
  gridProps = {} as DataGridProps,
}: {
  data: ColumnType[];
  columns?: () => GridColumns<ColumnType>;
  gridProps?: Partial<DataGridProps<ColumnType>>;
}): React.ReactElement {
  const {
    columns: _,
    rows: __,
    pageSize = 100,
    components = {},
    ...extraGridProps
  } = gridProps;
  return (
    <DataGrid
      autoHeight
      pageSize={pageSize}
      components={{ Pagination: () => <></>, ...components }}
      columns={columns()}
      rows={data}
      {...extraGridProps}
    ></DataGrid>
  );
}
