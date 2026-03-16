import BaseASAGridPage from "@/components/BaseASAGridPage";
import MatchCell from "@/components/MatchCell";
import { format } from "util";
import styles from "@/styles/Home.module.css";
import { transformXGMatchIntoASAMatch } from "@/utils/transform";

export default function XGForm() {
  return (
    <BaseASAGridPage<ASA.XgByGameApi["data"]>
      gridClass={styles.gridExtraWide}
      dataParser={(data) => {
        return Object.keys(data.xg).map((team, teamIdx) => {
          const teamData = data.xg[team];
          return [
            team,
            ...teamData.map((match, idx) => (
              <MatchCell
                key={`${teamIdx},${idx}`}
                renderValue={() =>
                  match.isHome
                    ? Number(match.away_player_xgoals).toFixed(3)
                    : Number(match.home_player_xgoals).toFixed(3)
                }
                match={transformXGMatchIntoASAMatch(match)}
              />
            )),
          ];
        });
      }}
      pageTitle="XG Against"
      endpoint={(year, league) =>
        format(`/api/asa/xg?year=%d&league=%s`, year, league)
      }
    >
      Data via{" "}
      <a href="https://www.americansocceranalysis.com/">
        American Soccer Analysis API
      </a>
    </BaseASAGridPage>
  );
}
