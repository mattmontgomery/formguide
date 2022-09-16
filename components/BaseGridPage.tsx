import styles from "@/styles/Home.module.css";
import MatchGrid from "./MatchGrid";
import BaseDataPage, { DataPageProps } from "./BaseDataPage";
import { useHomeAway } from "./Toggle/HomeAwayToggle";
import { useResultToggleAll } from "./Toggle/ResultToggle";
import { Box } from "@mui/material";

function BaseGridPage<T = Results.ParsedData>({
  renderControls,
  dataParser,
  pageTitle,
  gridClass = styles.gridClass,
  children,
  getEndpoint,
}: {
  renderControls?: DataPageProps["renderControls"];
  dataParser: Render.ParserFunction<T>;
  pageTitle: string;
  gridClass?: string;
  children?: React.ReactNode;
  getEndpoint?: DataPageProps["getEndpoint"];
}): React.ReactElement {
  const { value: homeAway, renderComponent: renderHomeAwayToggle } =
    useHomeAway();
  const { value: resultToggle, renderComponent: renderResultToggle } =
    useResultToggleAll();
  return (
    <BaseDataPage
      {...(getEndpoint
        ? {
            getEndpoint,
          }
        : {})}
      renderControls={() => (
        <Box sx={{ display: "flex", gap: 2, gridAutoColumns: 2 }}>
          <Box>{renderHomeAwayToggle()}</Box>
          <Box>Result: {renderResultToggle()}</Box>
          {renderControls && renderControls()}
        </Box>
      )}
      pageTitle={pageTitle}
      renderComponent={(data) => (
        <MatchGrid
          data={data.teams}
          dataParser={dataParser}
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
