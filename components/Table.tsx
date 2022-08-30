import { getColumns, Row } from "@/utils/table";
import { DataGrid } from "@mui/x-data-grid";

export default function Table({ data }: { data: Row[] }): React.ReactElement {
  return (
    <DataGrid
      autoHeight
      pageSize={100}
      components={{ Pagination: () => <></> }}
      columns={getColumns()}
      rows={data}
    ></DataGrid>
  );
}
