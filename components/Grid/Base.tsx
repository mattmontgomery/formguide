import styles from "@/styles/Home.module.css";
import Grid, { GridProps } from "./MatchGrid";
import BaseDataPage, { DataPageProps } from "../BaseDataPage";
import { useHomeAway } from "../Toggle/HomeAwayToggle";
import { useResultToggleAll } from "../Toggle/ResultToggle";
import { Box } from "@mui/material";

function BaseGridPage<T extends Results.Match>({
  children,
  getEndpoint,
  getShaded,
  getValue,
  gridClass = styles.gridClass,
  pageTitle,
  renderControls,
}: {
  children?: React.ReactNode;
  getEndpoint?: DataPageProps["getEndpoint"];
  getShaded?: GridProps<T>["getShaded"];
  getValue: GridProps<T>["getValue"];
  gridClass?: string;
  pageTitle: string;
  renderControls?: DataPageProps["renderControls"];
}): React.ReactElement {
  const { value: homeAway, renderComponent: renderHomeAwayToggle } =
    useHomeAway();
  const { value: resultToggle, renderComponent: renderResultToggle } =
    useResultToggleAll();
  return (
    <BaseDataPage<{ teams: Record<string, T[]> }>
      {...(getEndpoint
        ? {
            getEndpoint,
          }
        : {})}
      pageTitle={pageTitle}
      renderControls={() => (
        <Box sx={{ display: "flex", gap: 2, gridAutoColumns: 2 }}>
          <Box>{renderHomeAwayToggle()}</Box>
          <Box>Result: {renderResultToggle()}</Box>
          {renderControls && renderControls()}
        </Box>
      )}
      renderComponent={(data) => (
        <Grid<T>
          data={data.teams}
          getShaded={getShaded}
          getValue={getValue}
          gridClass={gridClass}
          homeAway={homeAway}
          result={resultToggle}
        />
      )}
    >
      {children}
    </BaseDataPage>
  );
}
export default BaseGridPage;
