import BaseDataPage from "@/components/BaseDataPage";
import VersusGrid from "@/components/VersusGrid";
import { getArrayAverage, getArraySum } from "@/utils/array";

export default function VersusPoints(): React.ReactElement {
  return (
    <BaseDataPage
      pageTitle="Results vs. (GD) | By Match"
      renderComponent={(data) => (
        <VersusGrid
          data={data}
          renderValue={(values) => `${values.length} / ${getArraySum(values)}`}
          getValue={(result) => result.gd || 0}
          getBackgroundColor={(points) => {
            if (!points || points.length === 0) {
              return "transparent";
            }
            const avg = getArrayAverage(points);
            return avg >= 1
              ? "success.main"
              : avg >= 0
                ? "warning.main"
                : "error.main";
          }}
          getForegroundColor={(points) => {
            if (!points || points.length === 0) {
              return "text.primary";
            }
            const avg = getArrayAverage(points);
            return avg >= 1
              ? "success.contrastText"
              : avg >= 0
                ? "warning.contrastText"
                : "error.contrastText";
          }}
        />
      )}
    />
  );
}
