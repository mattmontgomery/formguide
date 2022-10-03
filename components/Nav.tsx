import React, {
  Dispatch,
  ReactEventHandler,
  SetStateAction,
  useState,
} from "react";
import {
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
  Typography,
  SwipeableDrawer,
} from "@mui/material";
import Link from "next/link";

import LeagueContext from "./Context/League";
import { useContext } from "react";
import { NavigationConfig, Groups } from "@/constants/nav";
import type { NavItem } from "@/constants/nav";
import { CloseOutlined, KeyboardArrowDown } from "@mui/icons-material";
import LeagueSelect from "./App/LeagueSelect";

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

export type Subtitle = {
  subtitle: React.ReactNode;
};

export type NavProps = {
  drawerOpen: boolean;
  darkMode: boolean;
  league: Results.Leagues;
  onCloseDrawer: ReactEventHandler;
  onOpenDrawer: ReactEventHandler;
  onSetLeague: Dispatch<SetStateAction<Results.Leagues>>;
  setDarkMode: (darkMode: boolean) => void;
};

export default function Nav({
  drawerOpen = true,
  darkMode,
  league,
  onCloseDrawer,
  onOpenDrawer,
  onSetLeague,
  setDarkMode = () => null,
}: NavProps): React.ReactElement {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  return (
    <>
      <SwipeableDrawer
        anchor="left"
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        elevation={4}
        open={drawerOpen}
        onClose={onCloseDrawer}
        onOpen={onOpenDrawer}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 2,
            cursor: "pointer",
          }}
          onClick={onCloseDrawer}
        >
          <Typography variant="h4" color="primary.main">
            The Form Guide
          </Typography>
          <CloseOutlined />
        </Box>
        <Box sx={{ px: 2 }}>
          <Typography variant="overline">League</Typography>
          <LeagueSelect league={league} onSetLeague={onSetLeague} />
        </Box>
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
      </SwipeableDrawer>
    </>
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
