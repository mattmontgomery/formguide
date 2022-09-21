import React from "react";

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
  href: string;
  icon: SvgIconComponent;
  title: string;
  external?: boolean;
};

export type Subtitle = {
  subtitle: React.ReactNode;
};

const NavigationConfig: (NavItem | Subtitle | typeof Divider)[] = [
  { subtitle: "Points" },
  { href: "/", title: "Form Guide", icon: TableChart },
  { href: "/table", title: "League Table", icon: TableChart },
  { href: "/table/advanced", title: "Advanced League Table", icon: TableChart },
  { href: "/table/chart", title: "Points over Time", icon: Timeline },
  {
    href: "/table/position",
    title: "League Position over Time",
    icon: Timeline,
  },
  { href: "/points/cumulative", title: "Cumulative Points", icon: TableChart },
  { href: "/points/off-top", title: "Points off Top", icon: TableChart },
  Divider,
  { subtitle: "Projections" },
  {
    href: "/projected-standings",
    title: "Projected / Simulated League Standings",
    icon: TableChart,
  },
  {
    href: "/projections",
    title: "Interactive Projections and League Table",
    icon: TableChart,
  },
  {
    href: "/projected/points",
    title: "Projected points, based on home/away PPG",
    icon: TableChart,
  },
  Divider,
  { subtitle: "Fixtures" },
  { href: "/fixtures", title: "Upcoming Fixtures", icon: HourglassFull },
  { href: "/fixtures/today", title: "Today's Fixtures", icon: HourglassFull },
  Divider,
  { subtitle: "Rolling Charts" },
  { href: "/chart/3", title: "Rolling Points, 3-game", icon: BarChart },
  { href: "/chart/5", title: "Rolling Points, 5-game", icon: BarChart },
  { href: "/chart/8", title: "Rolling Points, 8-game", icon: BarChart },
  { href: "/chart/11", title: "Rolling Points, 11-game", icon: BarChart },
  Divider,
  { subtitle: "Results Vs." },
  { href: "/versus/record", title: "Record vs.", icon: BarChart },
  { href: "/versus", title: "PPG vs.", icon: BarChart },
  { href: "/versus/gd", title: "GD vs.", icon: BarChart },
  Divider,
  { subtitle: "Goal Difference" },
  { href: "/gd", title: "GD By Game", icon: SportsSoccerSharp },
  { href: "/gd/cumulative", title: "GD Cumulative", icon: SportsSoccerSharp },
  { href: "/gd-chart/3", title: "GD Rolling 3-game", icon: Timeline },
  { href: "/gd-chart/5", title: "GD Rolling 5-game", icon: Timeline },
  { href: "/gd-chart/8", title: "GD Rolling 8-game", icon: Timeline },
  { href: "/gd-chart/11", title: "GD Rolling 11-game", icon: Timeline },
  Divider,
  { subtitle: "Goals scored 2H - 1H" },
  {
    href: "/gd/team-by-half",
    title: "Goals Scored By Half",
    icon: SportsSoccerSharp,
  },
  {
    href: "/gd/team-by-half-conceded",
    title: "Goals Conceded By Half",
    icon: SportsSoccerSharp,
  },
  Divider,
  { subtitle: "Goals For" },
  { href: "/gf", title: "GF By Game", icon: SportsSoccerSharp },
  { href: "/gf/cumulative", title: "GF Cumulative", icon: SportsSoccerSharp },
  { href: "/gf-chart/3", title: "GF Rolling 3-game", icon: Timeline },
  { href: "/gf-chart/5", title: "GF Rolling 5-game", icon: Timeline },
  { href: "/gf-chart/8", title: "GF Rolling 8-game", icon: Timeline },
  { href: "/gf-chart/11", title: "GF Rolling 11-game", icon: Timeline },
  Divider,
  { subtitle: "Goals Against" },
  { href: "/ga", title: "GA By Game", icon: SportsSoccerSharp },
  { href: "/ga/cumulative", title: "GA Cumulative", icon: SportsSoccerSharp },
  { href: "/ga-chart/3", title: "GA Rolling 3-game", icon: Timeline },
  { href: "/ga-chart/5", title: "GA Rolling 5-game", icon: Timeline },
  { href: "/ga-chart/8", title: "GA Rolling 8-game", icon: Timeline },
  { href: "/ga-chart/11", title: "GA Rolling 11-game", icon: Timeline },
  Divider,
  { subtitle: "PPG/Schedule" },
  { href: "/ppg/opponent", title: "Opponent PPG By Game", icon: BarChart },
  { href: "/ppg/team", title: "Team PPG By Game", icon: BarChart },
  {
    href: "/ppg/differential",
    title: "PPG Differential By Game",
    icon: BarChart,
  },
  { href: "/ppg/outcomes", title: "Expected Outcomes", icon: BarChart },
  Divider,
  { subtitle: "First/Second Half" },
  {
    href: "/results/first-half",
    title: "First-half results only",
    icon: HourglassTop,
  },
  {
    href: "/results/second-half",
    title: "Second-half results only",
    icon: HourglassBottom,
  },
  {
    href: "/results/halftime-after-leading",
    title: "When leading @ Half",
    icon: HourglassEmpty,
  },
  {
    href: "/results/halftime-after-drawing",
    title: "When drawing @ Half",
    icon: HourglassEmpty,
  },
  {
    href: "/results/halftime-after-losing",
    title: "When losing @ Half",
    icon: HourglassEmpty,
  },
  {
    href: "/results/halftime/points/w",
    title: "Points when leading",
    icon: ListSharp,
  },
  {
    href: "/results/halftime/points/d",
    title: "Points when drawing",
    icon: ListSharp,
  },
  {
    href: "/results/halftime/points/l",
    title: "Points when losing",
    icon: ListSharp,
  },
  Divider,
  { subtitle: "Record since date" },
  {
    href: `/record/since/${format(startOfYear(new Date()), "yyy-MM-dd")}`,
    title: "Record since selected date",
    icon: CalendarViewWeek,
  },
  Divider,
  { subtitle: "Games since X" },
  {
    href: "/since-result/W",
    title: "Games since a win",
    icon: CalendarViewMonth,
  },
  {
    href: "/since-result/D",
    title: "Games since a draw",
    icon: CalendarViewMonth,
  },
  {
    href: "/since-result/W,D",
    title: "Games since a win or draw",
    icon: CalendarViewMonth,
  },
  {
    href: "/since-result/L",
    title: "Games since a loss",
    icon: CalendarViewMonth,
  },
  {
    href: "/since-result/opponent",
    title: "Games since opponent W/D/L (slumpbusters, streakbusters)",
    icon: CalendarViewMonth,
  },
  Divider,
  { subtitle: "Days Between Games" },
  {
    href: "/game-days/since",
    title: "Days Between Games",
    icon: CalendarViewMonth,
  },
  {
    href: "/game-days/since/3",
    title: "Days Between, Rolling 3-game",
    icon: Timeline,
  },
  {
    href: "/game-days/since/5",
    title: "Days Between, Rolling 5-game",
    icon: Timeline,
  },
  {
    href: "/game-days/since/8",
    title: "Days Between, Rolling 8-game",
    icon: Timeline,
  },
  {
    href: "/game-days/since/11",
    title: "Days Between, Rolling 11-game",
    icon: Timeline,
  },
  Divider,
  { subtitle: "Individual Match Stats" },
  ...Object.keys(stats).map((stat) => {
    return {
      href: `/stats/${stat}`,
      title: `By Match ${getStatsName(stat as ValidStats)}`,
      icon: Numbers,
    };
  }),
  Divider,
  { subtitle: "Individual Match Stats Comparisons" },
  ...Object.keys(stats).map((stat) => {
    return {
      href: `/stats/comparison/${stat}`,
      title: `Compare ${getStatsName(stat as ValidStats)}`,
      icon: Numbers,
    };
  }),
  Divider,
  { subtitle: "Rolling Match Stats" },
  ...Object.keys(stats).map((stat) => {
    return {
      href: `/stats/rolling/${stat}`,
      title: `Rolling ${getStatsName(stat as ValidStats)} (5-game)`,
      icon: Numbers,
    };
  }),
  Divider,
  { subtitle: "XG" },
  {
    href: "/xg/for",
    title: "XG For",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/against",
    title: "XG Against",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/difference",
    title: "XG Difference",
    icon: SportsSoccerOutlined,
  },
  { subtitle: "X Points" },
  {
    href: "/xg/rolling/xpoints/3",
    title: "X Points Rolling 3-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/xpoints/5",
    title: "X Points Rolling 5-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/xpoints/8",
    title: "X Points Rolling 8-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/xpoints/11",
    title: "X Points Rolling 11-game",
    icon: SportsSoccerOutlined,
  },
  { subtitle: "X Points Difference" },
  {
    href: "/xg/rolling/xpointsDifference/3",
    title: "X Points Diff Rolling 3-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/xpointsDifference/5",
    title: "X Points DiffRolling 5-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/xpointsDifference/8",
    title: "X Points Diff Rolling 8-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/xpointsDifference/11",
    title: "Rolling 11-game",
    icon: SportsSoccerOutlined,
  },
  { subtitle: "XG For" },
  {
    href: "/xg/rolling/for/3",
    title: "XGf Rolling 3-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/for/5",
    title: "XGf Rolling 5-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/for/8",
    title: "XGf Rolling 8-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/for/11",
    title: "XGf Rolling 11-game",
    icon: SportsSoccerOutlined,
  },
  { subtitle: "XG Against" },
  {
    href: "/xg/rolling/against/3",
    title: "XGa Rolling 3-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/against/5",
    title: "XGa Rolling 5-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/against/8",
    title: "XGa Rolling 8-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/against/11",
    title: "XGa Rolling 11-game",
    icon: SportsSoccerOutlined,
  },
  { subtitle: "XG Difference" },
  {
    href: "/xg/rolling/difference/3",
    title: "XGd Rolling 3-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/difference/5",
    title: "XGd Rolling 5-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/difference/8",
    title: "XGd Rolling 8-game",
    icon: SportsSoccerOutlined,
  },
  {
    href: "/xg/rolling/difference/11",
    title: "XGd Rolling 11-game",
    icon: SportsSoccerOutlined,
  },
  Divider,
  { subtitle: "Days Between Home Games" },
  {
    href: "/game-days/since-home",
    title: "Days Between Home Games",
    icon: CalendarViewMonth,
  },
  Divider,
  { subtitle: "Other" },
  {
    href: "/mls-player-stats/comparison/minutes",
    external: true,
    title: "MLS Player Minutes by Age",
    icon: Elderly,
  },
  {
    href: "/facts",
    title: "Match Facts",
    icon: LightbulbOutlined,
  },
  {
    href: "/odds",
    title: "Odds",
    icon: Money,
  },
  Divider,
  {
    subtitle: "Game States",
  },
  {
    href: "/game-states",
    title: "Best/Worst Game States",
    icon: Alarm,
  },
  {
    href: "/game-states/comebacks",
    title: "Comebacks",
    icon: Alarm,
  },
  {
    href: "/game-states/lost-leads",
    title: "Lost Leads",
    icon: Alarm,
  },
  {
    href: "/first-goal/gf",
    title: "First Goal Scored",
    icon: Watch,
  },
  {
    href: "/first-goal/ga",
    title: "First Goal Conceded",
    icon: Watch,
  },
  {
    href: "/first-goal/rolling/gf/3",
    title: "Rolling First Goal Scored (3-game)",
    icon: Watch,
  },
  {
    href: "/first-goal/rolling/gf/5",
    title: "Rolling First Goal Scored (5-game)",
    icon: Watch,
  },
  {
    href: "/first-goal/rolling/gf/8",
    title: "Rolling First Goal Scored (8-game)",
    icon: Watch,
  },
  {
    href: "/first-goal/rolling/ga/3",
    title: "Rolling First Goal Conceded (3-game)",
    icon: Watch,
  },
  {
    href: "/first-goal/rolling/ga/5",
    title: "Rolling First Goal Conceded (5-game)",
    icon: Watch,
  },
  {
    href: "/first-goal/rolling/ga/8",
    title: "Rolling First Goal Conceded (8-game)",
    icon: Watch,
  },
  Divider,
  { subtitle: "Player Stats" },
  {
    href: "/plus-minus",
    title: "Player Plus-Minus",
    icon: Person2TwoTone,
  },
  Divider,
  { subtitle: "Other Folks' Tools" },
  {
    href: "https://app.americansocceranalysis.com/",
    external: true,
    title: "ASA interactive tables",
    icon: LaunchTwoTone,
  },
];

export default NavigationConfig;

export { Divider, NavigationConfig };
