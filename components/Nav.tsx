import React from "react";
import {
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
  Paper,
} from "@mui/material";
import Link from "next/link";

import LeagueContext from "./LeagueContext";
import { useContext } from "react";
import {
  NavigationConfig,
  Divider as NavigationDivider,
} from "@/constants/nav";
import type { NavItem } from "@/constants/nav";

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
export const DRAWER_WIDTH = 300;

export type Subtitle = {
  subtitle: React.ReactNode;
};

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
        width: DRAWER_WIDTH + 10,
        flexShrink: 0,
        boxSizing: "border-box",
      }}
      variant={drawerOpen ? "permanent" : "temporary"}
      anchor="left"
    >
      <Paper
        sx={{
          width: DRAWER_WIDTH,
        }}
      >
        <List>
          {NavigationConfig.map((navItem, idx) => {
            if (navItem === NavigationDivider) {
              return <Divider key={idx} />;
            }
            if ((navItem as Subtitle).subtitle) {
              return (
                <ListSubheader key={idx}>
                  {(navItem as Subtitle).subtitle}
                </ListSubheader>
              );
            }
            const item = navItem as NavItem;
            if (item.href) {
              const LinkIcon = item.icon;
              return (
                <ListItemLink
                  href={item.external ? item.href : `/${league}${item.href}`}
                  key={idx}
                >
                  {LinkIcon && <ListItemIcon>{<LinkIcon />}</ListItemIcon>}
                  <ListItemText sx={{ fontSize: "0.725rem" }}>
                    {item.title}
                  </ListItemText>
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
      </Paper>
    </Drawer>
  );
}
