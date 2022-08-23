import "@/styles/globals.css";

import Head from "next/head";
import type { AppContext, AppProps } from "next/app";
import {
  AppBar,
  Box,
  Divider,
  CssBaseline,
  IconButton,
  Link as MLink,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
  Input,
} from "@mui/material";

import {
  KeyboardCommandKey,
  KeyboardControlKey,
  Menu as MenuIcon,
  Search,
  SearchSharp,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import Nav, { DRAWER_WIDTH, NavItem, NAV_CONFIG } from "@/components/Nav";
import YearContext, { DEFAULT_YEAR } from "@/components/YearContext";
import LeagueContext, { DEFAULT_LEAGUE } from "@/components/LeagueContext";
import { useRouter } from "next/router";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from "kbar";
import Results from "@/components/Results";

import useCookie from "react-use-cookie";
import { LeagueOptions } from "@/utils/Leagues";

export function MLSFormGuide({
  Component,
  league,
  pageProps,
}: AppProps & { league: Results.Leagues }): React.ReactElement {
  const router = useRouter();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState<boolean>(prefersDarkMode);
  const [year, setYear] = useState<number>(DEFAULT_YEAR);
  const [_league, setLeague] = useState<Results.Leagues>(
    league ? league : DEFAULT_LEAGUE
  );
  const [drawerOpen, setDrawerOpen] = useCookie("drawer-open", "open");

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          success: {
            main: darkMode ? "#8cca7a" : "#8cca7a",
          },
          warning: {
            main: darkMode ? "#f9c389" : "#f9c389",
          },
          error: {
            main: darkMode ? "#f3968f" : "#f3968f",
          },
        },
        typography: {
          h4: {
            fontSize: 24,
            fontWeight: "bold",
          },
        },
      }),
    [darkMode]
  );

  return (
    <YearContext.Provider value={year}>
      <LeagueContext.Provider value={_league}>
        <KBarProvider
          actions={[
            ...NAV_CONFIG.filter(
              (action) =>
                typeof action === "object" && Boolean((action as NavItem)?.href)
            ).map((action) => {
              const navItem = action as NavItem;
              return {
                id: navItem.href || navItem.title,
                name: navItem.title,
                perform: () => {
                  if (navItem.href.includes("http")) {
                    window.location.href = navItem.href;
                  } else {
                    router.push({
                      pathname: navItem.external
                        ? navItem.href
                        : `/${_league}${navItem.href}`,
                    });
                  }
                },
              };
            }),
            ...Object.entries(LeagueOptions).map(([l, leagueName]) => {
              return {
                id: `select-${l}`,
                name: `Select League: ${leagueName}`,
                perform: () => {
                  setLeague(l as Results.Leagues);
                  router.push({
                    pathname: router.pathname,
                    query: {
                      ...router.query,
                      league: l,
                    },
                  });
                },
              };
            }),
          ]}
        >
          <ThemeProvider theme={theme}>
            <KBarPortal>
              <KBarPositioner>
                <KBarAnimator
                  style={{
                    borderRadius: "0.25rem",
                    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
                    position: "absolute",
                    width: "80%",
                    maxWidth: "600px",
                    backgroundColor: darkMode
                      ? "rgba(0,0,0,0.9)"
                      : "rgba(255,255,255,0.9)",
                    color: darkMode ? "white" : "black",
                  }}
                >
                  <Input
                    startAdornment={<SearchSharp />}
                    sx={{
                      width: "100%",
                      paddingLeft: "1rem",
                      borderRadius: "0.25rem",
                      backgroundColor: darkMode
                        ? "rgb(30,60,90)"
                        : "rgba(255,255,255,0.9)",
                    }}
                    inputComponent={() => (
                      <KBarSearch
                        style={{
                          width: "100%",
                          backgroundColor: "transparent",
                          borderBottom: "2px solid rgba(149, 157, 165, 0.2)",
                          padding: "1rem 0.5rem",
                          fontSize: "1.5rem",
                          borderWidth: 0,
                          outline: 0,
                          color: darkMode ? "#f0f0f0" : "#111",
                        }}
                      />
                    )}
                  />
                  <Results darkMode={darkMode} />
                </KBarAnimator>
              </KBarPositioner>
            </KBarPortal>
            <Head>
              <meta title="MLS and NWSL Form Guide 2022" />
              <meta
                name="description"
                content="A tool to replace the old MLS Form Guide that mlssoccer.com retired"
              />
              <link rel="canonical" href="https://formguide.tools.football" />
            </Head>
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <Nav
                drawerOpen={drawerOpen === "open"}
                setDarkMode={setDarkMode}
                darkMode={darkMode}
              />
              <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
              >
                <AppBar
                  sx={{
                    marginLeft: drawerOpen === "open" ? DRAWER_WIDTH : 0,
                    width:
                      drawerOpen === "open"
                        ? `calc(100% - ${DRAWER_WIDTH}px)`
                        : "100%",
                  }}
                >
                  <Toolbar>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={() =>
                        setDrawerOpen(drawerOpen === "open" ? "closed" : "open")
                      }
                      edge="start"
                    >
                      <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                      Form Guide (2012–present)
                    </Typography>
                    <Typography
                      variant="h6"
                      noWrap
                      sx={{ flexGrow: 1, alignContent: "center" }}
                    >
                      <Search sx={{ position: "relative", top: "4px" }} />:{" "}
                      {"("}
                      <KeyboardCommandKey
                        sx={{ position: "relative", top: "4px" }}
                      />{" "}
                      or{" "}
                      <KeyboardControlKey
                        sx={{ position: "relative", top: "4px" }}
                      />
                      {")"}
                      +K
                    </Typography>
                    <Select
                      sx={{
                        backgroundColor: "background.paper",
                      }}
                      value={year}
                      onChange={(ev) => setYear(Number(ev.target.value))}
                    >
                      <MenuItem value={2022}>2022</MenuItem>
                      <Divider />
                      <MenuItem value={2012}>2012</MenuItem>
                      <MenuItem value={2013}>2013</MenuItem>
                      <MenuItem value={2014}>2014</MenuItem>
                      <MenuItem value={2015}>2015</MenuItem>
                      <MenuItem value={2016}>2016</MenuItem>
                      <MenuItem value={2017}>2017</MenuItem>
                      <MenuItem value={2018}>2018</MenuItem>
                      <MenuItem value={2019}>2019</MenuItem>
                      <MenuItem value={2020}>2020</MenuItem>
                      <MenuItem value={2021}>2021</MenuItem>
                    </Select>
                    <Select
                      sx={{
                        backgroundColor: "background.paper",
                      }}
                      value={_league}
                      onChange={(ev) => {
                        setLeague(
                          ev.target.value.toString() as Results.Leagues
                        );
                        router.push({
                          pathname: router.pathname,
                          query: {
                            ...router.query,
                            league: ev.target.value.toString(),
                          },
                        });
                      }}
                    >
                      <MenuItem>Select a league</MenuItem>
                      {Object.entries(LeagueOptions).map(
                        ([l, leagueName], idx) => (
                          <MenuItem key={idx} value={l}>
                            {leagueName}
                          </MenuItem>
                        )
                      )}
                      <MenuItem value="mls">MLS</MenuItem>
                      <MenuItem value="nwsl">NWSL</MenuItem>
                      <MenuItem value="mlsnp">MLS Next Pro</MenuItem>
                      <MenuItem value="uslc">USL Championship</MenuItem>
                      <MenuItem value="usl1">USL League One</MenuItem>
                      <MenuItem value="usl2">USL League Two</MenuItem>
                      <MenuItem value="nisa">NISA</MenuItem>
                      <Divider />
                      <MenuItem value="ligamx">Liga MX</MenuItem>
                      <MenuItem value="ligamx_ex">
                        Liga de Expansión MX
                      </MenuItem>
                      <Divider />
                      <MenuItem value="epl">English Premier League</MenuItem>
                    </Select>
                  </Toolbar>
                </AppBar>
                <Box sx={{ marginTop: 8 }}>
                  <Component {...pageProps} />
                </Box>
                <Divider />
                <footer>
                  <Box m={2}>
                    <MLink href="/changelog">Changelog</MLink> | Created and
                    maintained by{" "}
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
              </Box>
            </Box>
          </ThemeProvider>
        </KBarProvider>
      </LeagueContext.Provider>
    </YearContext.Provider>
  );
}

export default function RouterWrapped(
  props: React.PropsWithChildren<{
    Component: React.ReactElement;
    pageProps: unknown;
  }> &
    AppProps
): React.ReactElement {
  const router = useRouter();
  const league: Results.Leagues | undefined =
    router.pathname === "/"
      ? "mls"
      : (router.query.league?.toString() as Results.Leagues);
  return (
    <>
      {router.isReady && (
        <MLSFormGuide {...props} league={league as Results.Leagues} />
      )}
    </>
  );
}

MLSFormGuide.getStaticProps = async (ctx: AppContext) => {
  return { league: ctx.router.query?.league };
};
