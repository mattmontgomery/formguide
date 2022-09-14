import styles from "@/styles/Home.module.css";
import MatchGrid from "./MatchGrid";
import BaseDataPage, { DataPageProps } from "./BaseDataPage";

function BaseGridPage<T = Results.ParsedData>({
  controls,
  dataParser,
  pageTitle,
  gridClass = styles.gridClass,
  children,
  getEndpoint,
}: {
  controls?: DataPageProps["controls"];
  dataParser: Render.ParserFunction<T>;
  pageTitle: string;
  gridClass?: string;
  children?: React.ReactNode;
  getEndpoint?: DataPageProps["getEndpoint"];
}): React.ReactElement {
  return (
    <BaseDataPage
      {...(getEndpoint
        ? {
            getEndpoint,
          }
        : {})}
      controls={controls}
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
