import BaseGridPage from "@/components/BaseGridPage";
import getConsecutiveGames from "@/utils/getConsecutiveGames";

export default function MatchFactsNames(): React.ReactElement {
  return (
    <BaseGridPage
      pageTitle="Match Facts | future matches with consecutively alphabetically ordered names"
      dataParser={(data) => getConsecutiveGames(data, Object.keys(data).sort())}
    />
  );
}
