import styles from "@/styles/Home.module.css";
import MatchGrid from "./MatchGrid";
import BaseDataPage from "./BaseDataPage";

function BaseGridPage({
  dataParser,
  pageTitle,
  gridClass = styles.gridClass,
  children,
}: {
  dataParser: Render.ParserFunction;
  pageTitle: string;
  gridClass?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <BaseDataPage
      pageTitle={pageTitle}
      renderComponent={(data) => (
        <MatchGrid
          data={data.teams}
          dataParser={dataParser}
          gridClass={gridClass}
        />
      )}
    >
      {children}
    </BaseDataPage>
  );
}
export default BaseGridPage;
