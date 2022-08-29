import styles from "@/styles/Home.module.css";
import MatchGrid from "./MatchGrid";
import BaseDataPage, { DataPageProps } from "./BaseDataPage";

function BaseGridPage<T = Results.ParsedData>({
  dataParser,
  pageTitle,
  gridClass = styles.gridClass,
  children,
  getEndpoint,
}: {
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
