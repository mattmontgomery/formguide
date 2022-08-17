import styles from "@/styles/Home.module.css";
import MatchGrid from "@/components/MatchGrid";
import { format } from "util";
import BaseASADataPage from "./BaseASADataPage";

export default function BaseASARollingPage<T = ASA.XgByGameApi>({
  endpoint,
  pageTitle,
  periodLength,
  dataParser,
  children,
  getBackgroundColor = () => "success.main",
  isStaticHeight = true,
  isWide = false,
  stat,
}: React.PropsWithChildren<{
  endpoint: ASA.Endpoint;
  pageTitle: string;
  periodLength: number;
  dataParser: (data: {
    periodLength: number;
    data: T;
    getBackgroundColor: Render.GetBackgroundColor;
    isStaticHeight: boolean;
    isWide: boolean;
    stat: ASA.ValidStats;
  }) => Render.RenderReadyData;
  getBackgroundColor?: Render.GetBackgroundColor;
  isStaticHeight?: boolean;
  isWide?: boolean;
  stat: ASA.ValidStats;
}>): React.ReactElement {
  return (
    <BaseASADataPage<T>
      endpoint={endpoint}
      pageTitle={format(pageTitle, periodLength)}
      renderComponent={(data) =>
        data ? (
          <MatchGrid
            chartClass={isWide ? styles.chartWide : styles.chart}
            data={data}
            dataParser={(data) =>
              dataParser({
                periodLength,
                getBackgroundColor,
                data,
                isStaticHeight,
                isWide,
                stat,
              })
            }
            showMatchdayHeader={false}
          />
        ) : (
          <></>
        )
      }
    >
      {children}
    </BaseASADataPage>
  );
}
