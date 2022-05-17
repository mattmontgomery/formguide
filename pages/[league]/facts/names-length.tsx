import BaseGridPage from "@/components/BaseGridPage";
import getConsecutiveGames from "@/utils/getConsecutiveGames";

export default function MatchFactsNames(): React.ReactElement {
  return (
    <BaseGridPage
      pageTitle="Match Facts | future matches with consecutive opponents by length of name"
      dataParser={(data) =>
        getConsecutiveGames(
          data,
          Object.keys(data).sort((a, b) => {
            return a.length > b.length ? 1 : b.length > a.length ? -1 : 0;
          })
        )
      }
    />
  );
}
