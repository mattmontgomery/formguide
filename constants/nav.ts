import {
  TableChart,
  BarChart,
  HourglassTop,
  HourglassBottom,
  SportsSoccerSharp,
  SvgIconComponent,
  HourglassEmpty,
  Timeline,
  LightbulbOutlined,
  LaunchTwoTone,
  CalendarViewMonth,
  HourglassFull,
  CalendarViewWeek,
  ListSharp,
  SportsSoccerOutlined,
  Elderly,
  Money,
  Alarm,
  Watch,
  Person2TwoTone,
  Numbers,
} from "@mui/icons-material";

import { format, startOfYear } from "date-fns";
import { getStatsName, stats, ValidStats } from "@/components/Stats";

const Divider = Symbol("Divider");

export type NavItem = {
  group?: symbol;
  href: string;
  icon: SvgIconComponent;
  title: string;
  external?: boolean;
};

export const Groups: Record<string, symbol> = {
  Main: Symbol("Main"),
  Players: Symbol("Players"),
  Projected: Symbol("Projected"),
  Rolling: Symbol("Rolling"),
  GameStates: Symbol("Game States"),
  Fixtures: Symbol("Fixtures"),
  HeadToHead: Symbol("Head to Head"),
  Goals: Symbol("Goals"),
  PPG: Symbol("PPG"),
  Stats: Symbol("Stats"),
  StatsByMatch: Symbol("Stats By Match"),
  StatsRolling: Symbol("Stats Rolling"),
  StatsCompare: Symbol("Stats Compared"),
  AdvancedStats: Symbol("Advanced Stats"),
  GamesSince: Symbol("Game Since..."),
  Supplementary: Symbol("Supplementary Stats"),
};

const NavigationConfig: NavItem[] = [
  { href: "/", title: "Form Guide", icon: TableChart, group: Groups.Main },
  {
    href: "/table",
    title: "League Table",
    icon: TableChart,
    group: Groups.Main,
  },
  {
    href: "/table/advanced",
    title: "Advanced League Table",
    icon: TableChart,
    group: Groups.Main,
  },
  {
    href: "/table/chart",
    title: "Points over Time",
    icon: Timeline,
    group: Groups.Main,
  },
  {
    href: "/table/position",
    title: "League Position over Time",
    icon: Timeline,
    group: Groups.Main,
  },
  {
    href: "/points/cumulative",
    title: "Cumulative Points",
    icon: TableChart,
    group: Groups.Main,
  },
  {
    href: "/points/off-top",
    title: "Points off Top",
    icon: TableChart,
    group: Groups.Main,
  },
  {
    href: "/projected-standings",
    title: "Projected / Simulated League Standings",
    icon: TableChart,
    group: Groups.Projected,
  },
  {
    href: "/projections",
    title: "Interactive Projections and League Table",
    icon: TableChart,
    group: Groups.Projected,
  },
  {
    href: "/projected/points",
    title: "Projected points, based on home/away PPG",
    icon: TableChart,
    group: Groups.Projected,
  },
  {
    href: "/fixtures",
    title: "Upcoming Fixtures",
    icon: HourglassFull,
    group: Groups.Fixtures,
  },
  {
    href: "/fixtures/today",
    title: "Today's Fixtures",
    icon: HourglassFull,
    group: Groups.Fixtures,
  },
  {
    href: "/chart/3",
    title: "Rolling Points, 3-game",
    icon: BarChart,
    group: Groups.Rolling,
  },
  {
    href: "/chart/5",
    title: "Rolling Points, 5-game",
    icon: BarChart,
    group: Groups.Rolling,
  },
  {
    href: "/chart/8",
    title: "Rolling Points, 8-game",
    icon: BarChart,
    group: Groups.Rolling,
  },
  {
    href: "/chart/11",
    title: "Rolling Points, 11-game",
    icon: BarChart,
    group: Groups.Rolling,
  },
  {
    href: "/versus/record",
    title: "Record vs.",
    icon: BarChart,
    group: Groups.HeadToHead,
  },
  {
    href: "/versus",
    title: "PPG vs.",
    icon: BarChart,
    group: Groups.HeadToHead,
  },
  {
    href: "/versus/gd",
    title: "GD vs.",
    icon: BarChart,
    group: Groups.HeadToHead,
  },
  {
    href: "/gd",
    title: "GD By Game",
    icon: SportsSoccerSharp,
    group: Groups.Goals,
  },
  {
    href: "/gf-chart/5",
    title: "GF Rolling",
    icon: Timeline,
    group: Groups.Rolling,
  },
  {
    href: "/gd-chart/5",
    title: "GD Rolling",
    icon: Timeline,
    group: Groups.Rolling,
  },
  {
    href: "/ga-chart/5",
    title: "GA Rolling",
    icon: Timeline,
    group: Groups.Rolling,
  },
  {
    href: "/gd/cumulative",
    title: "GD Cumulative",
    icon: SportsSoccerSharp,
    group: Groups.Goals,
  },
  {
    href: "/gd/team-by-half",
    title: "Goals Scored By Half",
    icon: SportsSoccerSharp,
    group: Groups.Goals,
  },
  {
    href: "/gd/team-by-half-conceded",
    title: "Goals Conceded By Half",
    icon: SportsSoccerSharp,
    group: Groups.Goals,
  },
  {
    href: "/gf",
    title: "GF By Game",
    icon: SportsSoccerSharp,
    group: Groups.Goals,
  },
  {
    href: "/gf/cumulative",
    title: "GF Cumulative",
    icon: SportsSoccerSharp,
    group: Groups.Goals,
  },
  {
    href: "/ga",
    title: "GA By Game",
    icon: SportsSoccerSharp,
    group: Groups.Goals,
  },
  {
    href: "/ga/cumulative",
    title: "GA Cumulative",
    icon: SportsSoccerSharp,
    group: Groups.Goals,
  },
  {
    href: "/ppg/opponent",
    title: "Opponent PPG By Game",
    icon: BarChart,
    group: Groups.PPG,
  },
  {
    href: "/ppg/team",
    title: "Team PPG By Game",
    icon: BarChart,
    group: Groups.PPG,
  },
  {
    href: "/ppg/differential",
    title: "PPG Differential By Game",
    icon: BarChart,
    group: Groups.PPG,
  },
  {
    href: "/ppg/outcomes",
    title: "Expected Outcomes",
    icon: BarChart,
    group: Groups.PPG,
  },
  {
    href: "/results/first-half",
    title: "First-half results only",
    icon: HourglassTop,
    group: Groups.GameStates,
  },
  {
    href: "/results/second-half",
    title: "Second-half results only",
    icon: HourglassBottom,
    group: Groups.GameStates,
  },
  {
    href: "/results/halftime-after-leading",
    title: "When leading @ Half",
    icon: HourglassEmpty,
    group: Groups.GameStates,
  },
  {
    href: "/results/halftime-after-drawing",
    title: "When drawing @ Half",
    icon: HourglassEmpty,
    group: Groups.GameStates,
  },
  {
    href: "/results/halftime-after-losing",
    title: "When losing @ Half",
    icon: HourglassEmpty,
    group: Groups.GameStates,
  },
  {
    href: "/results/halftime/points/w",
    title: "Points when leading @ half",
    icon: ListSharp,
    group: Groups.GameStates,
  },
  {
    href: "/results/halftime/points/d",
    title: "Points when drawing @ half",
    icon: ListSharp,
    group: Groups.GameStates,
  },
  {
    href: "/results/halftime/points/l",
    title: "Points when losing @ half",
    icon: ListSharp,
    group: Groups.GameStates,
  },
  {
    href: `/record/since/${format(startOfYear(new Date()), "yyy-MM-dd")}`,
    title: "Record since selected date",
    icon: CalendarViewWeek,
    group: Groups.Supplementary,
  },
  {
    href: "/since-result/W",
    title: "Games since a win",
    icon: CalendarViewMonth,
    group: Groups.GamesSince,
  },
  {
    href: "/since-result/D",
    title: "Games since a draw",
    icon: CalendarViewMonth,
    group: Groups.GamesSince,
  },
  {
    href: "/since-result/W,D",
    title: "Games since a win or draw",
    icon: CalendarViewMonth,
    group: Groups.GamesSince,
  },
  {
    href: "/since-result/L",
    title: "Games since a loss",
    icon: CalendarViewMonth,
    group: Groups.GamesSince,
  },
  {
    href: "/since-result/opponent",
    title: "Games since opponent W/D/L (slumpbusters, streakbusters)",
    icon: CalendarViewMonth,
    group: Groups.GamesSince,
  },
  {
    href: "/game-days/since",
    title: "Days Between Games",
    icon: CalendarViewMonth,
    group: Groups.GamesSince,
  },
  {
    href: "/game-days/since/5",
    title: "Rolling Days Between Games",
    icon: Timeline,
    group: Groups.Rolling,
  },
  ...Object.keys(stats).map((stat) => {
    return {
      href: `/stats/${stat}`,
      title: getStatsName(stat as ValidStats),
      icon: Numbers,
      group: Groups.StatsByMatch,
    };
  }),
  {
    href: `/stats/finishing`,
    title: "Finishing %",
    icon: Numbers,
    group: Groups.StatsByMatch,
  },
  ...Object.keys(stats).map((stat) => {
    return {
      href: `/stats/comparison/${stat}`,
      title: getStatsName(stat as ValidStats),
      icon: Numbers,
      group: Groups.StatsCompare,
    };
  }),
  ...Object.keys(stats).map((stat) => {
    return {
      href: `/stats/rolling/${stat}`,
      title: getStatsName(stat as ValidStats),
      icon: Numbers,
      group: Groups.StatsRolling,
    };
  }),
  {
    href: `/stats/rolling/finishing`,
    title: "Finishing %",
    icon: Numbers,
    group: Groups.StatsRolling,
  },
  {
    href: "/xg/for",
    title: "XG For",
    icon: SportsSoccerOutlined,
    group: Groups.AdvancedStats,
  },
  {
    href: "/xg/against",
    title: "XG Against",
    icon: SportsSoccerOutlined,
    group: Groups.AdvancedStats,
  },
  {
    href: "/xg/difference",
    title: "XG Difference",
    icon: SportsSoccerOutlined,
    group: Groups.AdvancedStats,
  },
  {
    href: "/xg/rolling/xpoints/5",
    title: "X Points Rolling",
    icon: SportsSoccerOutlined,
    group: Groups.AdvancedStats,
  },
  {
    href: "/xg/rolling/xpointsDifference/5",
    title: "X Points Diff Rolling",
    icon: SportsSoccerOutlined,
    group: Groups.AdvancedStats,
  },
  {
    href: "/xg/rolling/for/5",
    title: "XG For Rolling",
    icon: SportsSoccerOutlined,
    group: Groups.AdvancedStats,
  },
  {
    href: "/xg/rolling/against/5",
    title: "XG Against Rolling",
    icon: SportsSoccerOutlined,
    group: Groups.AdvancedStats,
  },
  {
    href: "/xg/rolling/difference/5",
    title: "XG Difference Rolling",
    icon: SportsSoccerOutlined,
    group: Groups.AdvancedStats,
  },
  {
    href: "/game-days/since-home",
    title: "Days Between Home Games",
    icon: CalendarViewMonth,
    group: Groups.Main,
  },
  {
    href: "/mls-player-stats/comparison/minutes",
    external: true,
    title: "MLS Player Minutes by Age",
    icon: Elderly,
    group: Groups.Stats,
  },
  {
    href: "/facts",
    title: "Match Facts",
    icon: LightbulbOutlined,
    group: Groups.Supplementary,
  },
  {
    href: "/odds",
    title: "Odds",
    icon: Money,
    group: Groups.Main,
  },
  {
    href: "/game-states",
    title: "Best/Worst Game States",
    icon: Alarm,
    group: Groups.GameStates,
  },
  {
    href: "/game-states/comebacks",
    title: "Comebacks",
    icon: Alarm,
    group: Groups.GameStates,
  },
  {
    href: "/game-states/lost-leads",
    title: "Lost Leads",
    icon: Alarm,
    group: Groups.GameStates,
  },
  {
    href: "/first-goal/gf",
    title: "First Goal Scored",
    icon: Watch,
    group: Groups.Stats,
  },
  {
    href: "/first-goal/ga",
    title: "First Goal Conceded",
    icon: Watch,
    group: Groups.Stats,
  },
  {
    href: "/first-goal/rolling/gf/5",
    title: "Rolling First Goal Scored",
    icon: Watch,
    group: Groups.Rolling,
  },
  {
    href: "/first-goal/rolling/ga/5",
    title: "Rolling First Goal Conceded",
    icon: Watch,
    group: Groups.Rolling,
  },
  {
    href: "/plus-minus",
    title: "Player Plus-Minus",
    icon: Person2TwoTone,
    group: Groups.AdvancedStats,
  },
  {
    href: "https://app.americansocceranalysis.com/",
    external: true,
    title: "ASA interactive tables",
    icon: LaunchTwoTone,
    group: Groups.AdvancedStats,
  },
  {
    title: "Team Player Minutes",
    href: "/player-minutes",
    icon: Person2TwoTone,
    group: Groups.Players,
  },
];

export default NavigationConfig;

export { Divider, NavigationConfig };
