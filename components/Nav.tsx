import React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemProps,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Link from "next/link";

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
} from "@mui/icons-material";

import LeagueContext from "./LeagueContext";
import { useContext } from "react";
import { format, startOfYear } from "date-fns";

const ListItemLink = React.forwardRef<ListItemProps, any>(
  ({ href, as, ...props }, ref) => {
    return (
      <Link href={href} as={as} passHref>
        <ListItem
          button
          ref={ref}
          sx={{
            [`.MuiListItemText-root .MuiTypography-root`]: {
              fontSize: `.9rem`,
            },
          }}
          {...props}
        />
      </Link>
    );
  }
);
ListItemLink.displayName = "ListItemLink";
const DRAWER_WIDTH = 240;

const DIVIDER = Symbol("divider");

const NAV_CONFIG: (
  | {
      href?: string;
      external?: boolean;
      title?: React.ReactNode;
      subtitle?: React.ReactNode;
      icon?: SvgIconComponent;
    }
  | typeof DIVIDER
)[] = [
  { subtitle: "Points" },
  { href: "/", title: "Form Guide", icon: TableChart },
  { href: "/table", title: "League Table", icon: TableChart },
  { href: "/table/chart", title: "Points over Time", icon: Timeline },
  { href: "/points/cumulative", title: "Cumulative Points", icon: TableChart },
  { href: "/points/off-top", title: "Points off Top", icon: TableChart },
  { href: "/projected/points", title: "Projected (PPG)", icon: TableChart },
  DIVIDER,
  { subtitle: "Fixtures" },
  { href: "/fixtures", title: "Today's Fixtures", icon: HourglassFull },
  DIVIDER,
  { subtitle: "Rolling Charts" },
  { href: "/chart/3", title: "3-game", icon: BarChart },
  { href: "/chart/5", title: "5-game", icon: BarChart },
  { href: "/chart/8", title: "8-game", icon: BarChart },
  { href: "/chart/11", title: "11-game", icon: BarChart },
  DIVIDER,
  { subtitle: "Results Vs." },
  { href: "/versus/record", title: "Record", icon: BarChart },
  { href: "/versus", title: "PPG", icon: BarChart },
  { href: "/versus/gd", title: "GD", icon: BarChart },
  DIVIDER,
  { subtitle: "Goal Difference" },
  { href: "/gd", title: "GD", icon: SportsSoccerSharp },
  { href: "/gd/cumulative", title: "Cumulative", icon: SportsSoccerSharp },
  { href: "/gd-chart/3", title: "Rolling 3-game", icon: Timeline },
  { href: "/gd-chart/5", title: "Rolling 5-game", icon: Timeline },
  { href: "/gd-chart/8", title: "Rolling 8-game", icon: Timeline },
  { href: "/gd-chart/11", title: "Rolling 11-game", icon: Timeline },
  DIVIDER,
  { subtitle: "Goals scored 2H - 1H" },
  { href: "/gd/team-by-half", title: "Scored", icon: SportsSoccerSharp },
  {
    href: "/gd/team-by-half-conceded",
    title: "Conceded",
    icon: SportsSoccerSharp,
  },
  DIVIDER,
  { subtitle: "Goals For" },
  { href: "/gf", title: "GF", icon: SportsSoccerSharp },
  { href: "/gf/cumulative", title: "Cumulative", icon: SportsSoccerSharp },
  { href: "/gf-chart/3", title: "Rolling 3-game", icon: Timeline },
  { href: "/gf-chart/5", title: "Rolling 5-game", icon: Timeline },
  { href: "/gf-chart/8", title: "Rolling 8-game", icon: Timeline },
  { href: "/gf-chart/11", title: "Rolling 11-game", icon: Timeline },
  DIVIDER,
  { subtitle: "Goals Against" },
  { href: "/ga", title: "GA", icon: SportsSoccerSharp },
  { href: "/ga/cumulative", title: "Cumulative", icon: SportsSoccerSharp },
  { href: "/ga-chart/3", title: "Rolling 3-game", icon: Timeline },
  { href: "/ga-chart/5", title: "Rolling 5-game", icon: Timeline },
  { href: "/ga-chart/8", title: "Rolling 8-game", icon: Timeline },
  { href: "/ga-chart/11", title: "Rolling 11-game", icon: Timeline },
  DIVIDER,
  { subtitle: "PPG/Schedule" },
  { href: "/ppg/opponent", title: "Opponent PPG", icon: BarChart },
  { href: "/ppg/team", title: "Team PPG", icon: BarChart },
  { href: "/ppg/differential", title: "PPG Differential", icon: BarChart },
  { href: "/ppg/outcomes", title: "Expected Outcomes", icon: BarChart },
  DIVIDER,
  { subtitle: "First/Second Half" },
  { href: "/results/first-half", title: "First-half only", icon: HourglassTop },
  {
    href: "/results/second-half",
    title: "Second-half only",
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
  DIVIDER,
  { subtitle: "Record since date" },
  {
    href: `/record/since/${format(startOfYear(new Date()), "yyy-MM-dd")}`,
    title: "Record since selected date",
    icon: CalendarViewWeek,
  },
  DIVIDER,
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
  DIVIDER,
  { subtitle: "Days Between Games" },
  {
    href: "/game-days/since",
    title: "Days Between Games",
    icon: CalendarViewMonth,
  },
  { href: "/game-days/since/3", title: "Rolling 3-game", icon: Timeline },
  { href: "/game-days/since/5", title: "Rolling 5-game", icon: Timeline },
  { href: "/game-days/since/8", title: "Rolling 8-game", icon: Timeline },
  { href: "/game-days/since/11", title: "Rolling 11-game", icon: Timeline },
  DIVIDER,
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
  DIVIDER,
  { subtitle: "Days Between Home Games" },
  {
    href: "/game-days/since-home",
    title: "Days Between Home Games",
    icon: CalendarViewMonth,
  },
  DIVIDER,
  { subtitle: "Other" },
  {
    href: "/facts",
    title: "Match Facts",
    icon: LightbulbOutlined,
  },
  DIVIDER,
  { subtitle: "Other Folks' Tools" },
  {
    href: "https://app.americansocceranalysis.com/",
    external: true,
    title: "ASA interactive tables",
    icon: LaunchTwoTone,
  },
];

export default function Nav({
  drawerOpen = true,
  darkMode,
  setDarkMode = () => null,
}: {
  drawerOpen: boolean;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}): React.ReactElement {
  const league = useContext(LeagueContext);
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
      variant={drawerOpen ? "permanent" : "temporary"}
      anchor="left"
    >
      <Box sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <List>
          {NAV_CONFIG.map((navItem, idx) => {
            if (typeof navItem === "symbol") {
              return <Divider key={idx} />;
            } else if (navItem.subtitle) {
              return (
                <ListSubheader key={idx}>{navItem.subtitle}</ListSubheader>
              );
            } else if (navItem.href) {
              const LinkIcon = navItem.icon;
              return (
                <ListItemLink
                  href={
                    navItem.external
                      ? navItem.href
                      : `/${league}${navItem.href}`
                  }
                  key={idx}
                >
                  {LinkIcon && <ListItemIcon>{<LinkIcon />}</ListItemIcon>}
                  <ListItemText>{navItem.title}</ListItemText>
                </ListItemLink>
              );
            }
          })}
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(event) => setDarkMode(event.target.checked)}
                />
              }
              label="Dark Mode"
            />
          </ListItem>
          <Divider />
          <ListItemLink href="https://lineup.tools.football">
            <ListItemText>Lineup Graphic Builder</ListItemText>
          </ListItemLink>
        </List>
      </Box>
    </Drawer>
  );
}
