import styles from "@/styles/Home.module.css";
import MatchGrid from "./MatchGrid";
import BaseASADataPage from "./BaseASADataPage";

export default function BaseASAGridPage<T, U = Record<string, unknown>>({
  endpoint,
  dataParser,
  pageTitle,
  gridClass = styles.gridClass,
  children,
}: {
  endpoint: ASA.Endpoint;
  dataParser: Render.GenericParserFunction<T>;
  pageTitle: string;
  gridClass?: string;
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <BaseASADataPage<T, U>
      endpoint={endpoint}
      pageTitle={pageTitle}
      renderComponent={(data) => (
        <MatchGrid<T>
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
