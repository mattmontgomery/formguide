import "../styles/globals.css";
import NavStyles from "../styles/Nav.module.css";
import type { AppProps } from "next/app";
import Link, { LinkProps } from "next/link";
import {
  Box,
  Button,
  ButtonProps,
  Divider,
  Drawer,
  Link as MLink,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  CssBaseline,
  ListItemProps,
  AppBar,
  Toolbar,
  IconButton,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
} from "@mui/material";

import {
  TableChart,
  BarChart,
  SportsSoccerSharp,
  SportsSoccerTwoTone,
  SportsSoccerRounded,
  Menu as MenuIcon,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import Changelog from "../components/Changelog";
import { useRouter } from "next/router";

const DRAWER_WIDTH = 240;

export type ButtonLinkProps = Omit<ButtonProps, "href" | "classes"> &
  Pick<LinkProps, "href" | "as" | "prefetch">;

const ListItemLink = React.forwardRef<ListItemProps, any>(
  ({ href, as, ...props }, ref) => {
    return (
      <Link href={href} as={as} passHref>
        <ListItem button ref={ref} {...props} />
      </Link>
    );
  }
);
ListItemLink.displayName = "ListItemLink";

const ButtonLink = React.forwardRef<ButtonLinkProps, any>(
  ({ href, as, prefetch, ...props }, ref) => {
    const { pathname } = useRouter();
    return (
      <Link href={href} as={as} prefetch={prefetch} passHref>
        <Button
          ref={ref}
          size="small"
          variant="outlined"
          {...props}
          color={pathname === href ? "secondary" : "primary"}
        />
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";

export default function MLSFormGuide({
  Component,
  pageProps,
}: AppProps): React.ReactElement {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState<boolean>(prefersDarkMode);

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
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
              <ListItemLink href="/">
                <ListItemIcon>
                  <TableChart />
                </ListItemIcon>
                <ListItemText>Form Guide</ListItemText>
              </ListItemLink>
              <Divider />
              <ListSubheader>Rolling Charts</ListSubheader>
              <ListItemLink href="/chart/3">
                <ListItemIcon>
                  <BarChart />
                </ListItemIcon>
                <ListItemText>3-game</ListItemText>
              </ListItemLink>
              <ListItemLink href="/chart/5">
                <ListItemIcon>
                  <BarChart />
                </ListItemIcon>
                <ListItemText>5-game</ListItemText>
              </ListItemLink>
              <ListItemLink href="/chart/8">
                <ListItemIcon>
                  <BarChart />
                </ListItemIcon>
                <ListItemText>8-game</ListItemText>
              </ListItemLink>
              <ListItemLink href="/chart/11">
                <ListItemIcon>
                  <BarChart />
                </ListItemIcon>
                <ListItemText>11-game</ListItemText>
              </ListItemLink>
              <Divider />
              <ListSubheader>Goal Difference</ListSubheader>
              <ListItemLink href="/goal-difference">
                <ListItemIcon>
                  <SportsSoccerRounded />
                </ListItemIcon>
                <ListItemText>GD</ListItemText>
              </ListItemLink>
              <ListItemLink href="/goal-difference-cumulative">
                <ListItemIcon>
                  <SportsSoccerRounded />
                </ListItemIcon>
                <ListItemText>Cumulative</ListItemText>
              </ListItemLink>
              <Divider />
              <ListSubheader>Goals For</ListSubheader>
              <ListItemLink href="/goals-for">
                <ListItemIcon>
                  <SportsSoccerSharp />
                </ListItemIcon>
                <ListItemText>GF</ListItemText>
              </ListItemLink>
              <ListItemLink href="/goals-for-cumulative">
                <ListItemIcon>
                  <SportsSoccerSharp />
                </ListItemIcon>
                <ListItemText>Cumulative</ListItemText>
              </ListItemLink>
              <Divider />
              <ListSubheader>Goals Against</ListSubheader>
              <ListItemLink href="/goals-against">
                <ListItemIcon>
                  <SportsSoccerTwoTone />
                </ListItemIcon>
                <ListItemText>GA</ListItemText>
              </ListItemLink>
              <ListItemLink href="/goals-against-cumulative">
                <ListItemIcon>
                  <SportsSoccerTwoTone />
                </ListItemIcon>
                <ListItemText>Cumulative</ListItemText>
              </ListItemLink>
            </List>
            <Divider />
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
              Lineup Graphic Builder
            </ListItemLink>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <AppBar
            sx={{
              marginLeft: drawerOpen ? DRAWER_WIDTH : 0,
              width: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : "100%",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setDrawerOpen(!drawerOpen)}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                2021 MLS Form Guide
              </Typography>
            </Toolbar>
          </AppBar>
          <Box sx={{ marginTop: 8 }}>
            <Component {...pageProps} />
          </Box>
          <Divider />
          <footer>
            <Box m={2}>
              Created and maintained by{" "}
              <MLink href="https://twitter.com/thecrossbarrsl">
                Matt Montgomery
              </MLink>
              .{" "}
              <MLink href="https://github.com/mattmontgomery/formguide">
                Contribute on Github
              </MLink>
              . Something not working? Send me a tweet.
            </Box>
          </footer>
          <Divider />
          <footer className={NavStyles.Changelog}>
            <Box m={2}>
              <Changelog />
            </Box>
          </footer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
