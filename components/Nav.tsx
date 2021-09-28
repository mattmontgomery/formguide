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
} from "@mui/icons-material";

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
      title?: React.ReactNode;
      subtitle?: React.ReactNode;
      icon?: SvgIconComponent;
    }
  | typeof DIVIDER
)[] = [
  { href: "/", title: "Form Guide", icon: TableChart },
  DIVIDER,
  { subtitle: "Rolling Charts" },
  { href: "/chart/3", title: "3-game", icon: BarChart },
  { href: "/chart/5", title: "5-game", icon: BarChart },
  { href: "/chart/8", title: "8-game", icon: BarChart },
  { href: "/chart/11", title: "11-game", icon: BarChart },
  DIVIDER,
  { subtitle: "Goal Difference" },
  { href: "/gd", title: "GD", icon: SportsSoccerSharp },
  { href: "/gd/cumulative", title: "Cumulative", icon: SportsSoccerSharp },
  { href: "/gd-chart/3", title: "Rolling 3-game", icon: Timeline },
  { href: "/gd-chart/5", title: "Rolling 5-game", icon: Timeline },
  { href: "/gd-chart/8", title: "Rolling 8-game", icon: Timeline },
  { href: "/gd-chart/11", title: "Rolling 11-game", icon: Timeline },
  DIVIDER,
  { subtitle: "Goals For" },
  { href: "/gf", title: "GF", icon: SportsSoccerSharp },
  { href: "/gf/cumulative", title: "Cumulative", icon: SportsSoccerSharp },
  DIVIDER,
  { subtitle: "Goals Against" },
  { href: "/ga", title: "GA", icon: SportsSoccerSharp },
  { href: "/ga/cumulative", title: "Cumulative", icon: SportsSoccerSharp },
  DIVIDER,
  { subtitle: "PPG/Strength of Schedule" },
  { href: "/ppg/opponent", title: "Opponent PPG", icon: BarChart },
  { href: "/ppg/team", title: "Team PPG", icon: BarChart },
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
    href: "/results/halftime-after-leading",
    title: "When drawing @ Half",
    icon: HourglassEmpty,
  },
  {
    href: "/results/halftime-after-losing",
    title: "When losing @ Half",
    icon: HourglassEmpty,
  },
  DIVIDER,
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
          {NAV_CONFIG.map((navItem) => {
            if (typeof navItem === "symbol") {
              return <Divider />;
            } else if (navItem.subtitle) {
              return <ListSubheader>{navItem.subtitle}</ListSubheader>;
            } else if (navItem.href) {
              const LinkIcon = navItem.icon;
              return (
                <ListItemLink href={navItem.href}>
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
