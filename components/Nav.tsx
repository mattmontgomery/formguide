import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemProps,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Paper,
  ListItemButton,
  Box,
} from "@mui/material";
import Link from "next/link";

import LeagueContext from "./Context/League";
import { useContext } from "react";
import { NavigationConfig, Groups } from "@/constants/nav";
import type { NavItem } from "@/constants/nav";
import { KeyboardArrowDown } from "@mui/icons-material";

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
          {Object.entries(Groups).map(([group], idx) => (
            <React.Fragment key={idx}>
              <NavSection group={group} key={idx} />
            </React.Fragment>
          ))}
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
          <ListItemLink href="https://lineup.tools.football">
            <ListItemText>Lineup Graphic Builder</ListItemText>
          </ListItemLink>
        </List>
      </Paper>
    </Drawer>
  );
}

function NavSection({
  group,
}: {
  group: keyof typeof Groups;
}): React.ReactElement {
  const [open, setOpen] = useState<boolean>(true);
  const league = useContext(LeagueContext);
  return (
    <Box>
      <ListItemButton
        alignItems="flex-start"
        onClick={() => setOpen(!open)}
        sx={{
          borderBottom: "1px solid transparent",
          borderBottomColor: open ? "transparent" : "secondary.main",
          px: 3,
          pt: 2.5,
          pb: 2.5,
          mb: 1.5,
          mt: 1.5,
        }}
      >
        <ListItemText
          primary={Groups[group].description ?? group}
          primaryTypographyProps={{
            fontSize: 15,
            fontWeight: "medium",
            mb: "2px",
          }}
        />
        <KeyboardArrowDown
          sx={{
            mr: -1,
            opacity: 1,
            transform: open ? "rotate(-180deg)" : "rotate(0)",
            transition: "0.2s",
          }}
        />
      </ListItemButton>
      {open &&
        NavigationConfig.filter((item) => item.group === Groups[group]).map(
          (navItem, idx) => {
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
          }
        )}
    </Box>
  );
}
