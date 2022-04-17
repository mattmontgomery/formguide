import BaseDataPage from "@/components/BaseDataPage";
import VersusGrid from "@/components/VersusGrid";
import { getArrayAverage, getArrayAverageFormatted } from "@/utils/array";
import getMatchPoints from "@/utils/getMatchPoints";

export default function VersusPoints(): React.ReactElement {
  return (
    <BaseDataPage
      pageTitle="Results vs. (PPG) | By Match"
      renderComponent={(data) => (
        <VersusGrid
          data={data}
          renderValue={(values) =>
            `${values.length} / ${getArrayAverageFormatted(values, 1)}`
          }
          getValue={getMatchPoints}
          getBackgroundColor={(points) => {
            if (!points || points.length === 0) {
              return "#f0f0f0";
            }
            const avg = getArrayAverage(points);
            return avg >= 2
              ? "success.main"
              : avg >= 1
              ? "warning.main"
              : "error.main";
          }}
        />
      )}
    />
  );
}
