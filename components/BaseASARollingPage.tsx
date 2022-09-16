import styles from "@/styles/Home.module.css";
import MatchGrid from "@/components/MatchGrid";
import { format } from "util";
import BaseASADataPage from "./BaseASADataPage";
import { BasePageProps } from "./BasePage";
import { useHomeAway } from "./Toggle/HomeAwayToggle";
import { useResultToggleAll } from "./Toggle/ResultToggle";
import { Box } from "@mui/system";

export default function BaseASARollingPage<T = ASA.XgByGameApi>({
  renderControls,
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
  renderControls?: BasePageProps["renderControls"];
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
  const { value: homeAway, renderComponent: renderHomeAwayToggle } =
    useHomeAway();
  const { value: resultToggle, renderComponent: renderResultToggle } =
    useResultToggleAll();
  return (
    <BaseASADataPage<T>
      renderControls={() => (
        <Box sx={{ display: "flex", gap: 2, gridAutoColumns: 2 }}>
          <Box>{renderHomeAwayToggle()}</Box>
          <Box>Result: {renderResultToggle()}</Box>
          {renderControls && renderControls()}
        </Box>
      )}
      endpoint={endpoint}
      pageTitle={format(pageTitle, periodLength)}
      renderComponent={(data) =>
        data ? (
          <MatchGrid
            chartClass={isWide ? styles.chartWide : styles.chart}
            data={data}
            homeAway={homeAway}
            result={resultToggle}
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
