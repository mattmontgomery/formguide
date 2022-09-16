import styles from "@/styles/Home.module.css";
import MatchGrid from "./MatchGrid";
import BaseASADataPage from "./BaseASADataPage";
import { useHomeAway } from "./Toggle/HomeAwayToggle";
import { useResultToggleAll } from "./Toggle/ResultToggle";
import { Box } from "@mui/material";
import { BasePageProps } from "./BasePage";

export default function BaseASAGridPage<T, U = Record<string, unknown>>({
  renderControls,
  endpoint,
  dataParser,
  pageTitle,
  gridClass = styles.gridClass,
  children,
}: {
  renderControls?: BasePageProps["renderControls"];
  endpoint: ASA.Endpoint;
  dataParser: Render.GenericParserFunction<T>;
  pageTitle: string;
  gridClass?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const { value: homeAway, renderComponent: renderHomeAwayToggle } =
    useHomeAway();
  const { value: resultToggle, renderComponent: renderResultToggle } =
    useResultToggleAll();
  return (
    <BaseASADataPage<T, U>
      endpoint={endpoint}
      pageTitle={pageTitle}
      renderControls={() => (
        <Box sx={{ display: "flex", gap: 2, gridAutoColumns: 2 }}>
          <Box>{renderHomeAwayToggle()}</Box>
          <Box>Result: {renderResultToggle()}</Box>
          {renderControls && renderControls()}
        </Box>
      )}
      renderComponent={(data) => (
        <MatchGrid<T>
          homeAway={homeAway}
          result={resultToggle}
          data={data}
          dataParser={dataParser}
          gridClass={gridClass}
        />
      )}
    >
      {children}
    </BaseASADataPage>
  );
}
