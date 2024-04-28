declare namespace TheOdds {
  type Entry = {
    id: string;
    sport_key: string;
    sport_title: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: Bookmaker[];
  };
  type Bookmaker = {
    key: string;
    title: string;
    last_update: string;
    markets: Market[];
  };
  type Market = {
    key: "h2h" | "totals" | "spreads";
    outcomes: {
      name: string | "Draw";
      price: number;
      point?: number;
    }[];
  };
}
