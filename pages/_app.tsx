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
  Paper,
} from "@mui/material";

import {
  KeyboardCommandKey,
  KeyboardControlKey,
  Menu as MenuIcon,
  Search,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import Nav, { DRAWER_WIDTH } from "@/components/Nav";
import YearContext, { DEFAULT_YEAR } from "@/components/YearContext";
import LeagueContext, { DEFAULT_LEAGUE } from "@/components/LeagueContext";
import { useRouter } from "next/router";
import { KBarAnimator, KBarPortal, KBarPositioner } from "kbar";
import KBarProvider from "@/components/KBarProvider";
import Results from "@/components/Results";

import { blueGrey, deepOrange, deepPurple } from "@mui/material/colors";

import useCookie from "react-use-cookie";
import { LeagueOptions } from "@/utils/Leagues";
import DarkMode from "@/components/Context/DarkMode";
import KBarInput from "@/components/KBar/Input";
import { useEasterEgg } from "@/components/EasterEgg";

export function MLSFormGuide({
  Component,
  league,
  pageProps,
}: AppProps & { league: Results.Leagues }): React.ReactElement {
  const router = useRouter();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState<boolean>(prefersDarkMode);
  const [year, setYear] = useState<number>(DEFAULT_YEAR);
  const { easterEgg, renderComponent } = useEasterEgg();
  const [_league, setLeague] = useState<Results.Leagues>(
    league ?? DEFAULT_LEAGUE
  );
  const [drawerOpen, setDrawerOpen] = useCookie("drawer-open", "open");

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);
  const theme = React.useMemo(
    () =>
      createTheme({
        typography: {
          h4: {
            fontSize: 24,
            fontWeight: "bold",
          },
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(","),
        },
        palette: {
          mode: darkMode ? "dark" : "light",
          ...(easterEgg
            ? {
                primary: {
                  main: deepPurple["300"],
                },
              }
            : {
                primary: {
                  main: darkMode ? deepOrange["50"] : deepOrange["700"],
                },
              }),
          secondary: {
            main: deepPurple["500"],
          },
          success: {
            main: "#60C76F",
          },
          warning: {
            main: "#FFC942",
          },
          error: {
            // main: orange["300"],
            main: "#E48888",
          },
          background: {
            default: darkMode ? blueGrey["800"] : blueGrey["50"],
          },
        },
      }),
    [darkMode, easterEgg]
  );

  return (
    <YearContext.Provider value={year}>
      <LeagueContext.Provider value={_league}>
        {renderComponent()}

        <ThemeProvider theme={theme}>
          <DarkMode.Provider value={darkMode}>
            <KBarProvider onSetLeague={(league) => setLeague(league)}>
              <Head>
                <meta title="MLS, NWSL and More | Soccer Form Guide" />
                <meta
                  name="description"
                  content="A tool to replace the old MLS Form Guide that mlssoccer.com retired"
                />
                <link rel="canonical" href="https://formguide.tools.football" />
              </Head>
              <Box sx={{ display: "flex", position: "relative", zIndex: 1 }}>
                <CssBaseline />
                <Nav
                  drawerOpen={drawerOpen === "open"}
                  setDarkMode={setDarkMode}
                  darkMode={darkMode}
                />
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    backgroundColor: "background.default",
                    py: 2,
                    px: 1,
                  }}
                >
                  <AppBar
                    sx={{
                      width:
                        drawerOpen === "open"
                          ? `calc(100% - ${DRAWER_WIDTH}px)`
                          : "100%",
                    }}
                  >
                    <Toolbar sx={{ gap: 1 }}>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() =>
                          setDrawerOpen(
                            drawerOpen === "open" ? "closed" : "open"
                          )
                        }
                        edge="start"
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{ flexGrow: 1, fontWeight: "bold" }}
                      >
                        The Form Guide{easterEgg ? "!!" : ""}
                      </Typography>
                      <Box sx={{ alignContent: "center", fontWeight: "bold" }}>
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
                      </Box>
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
                        <MenuItem disabled>Select a league</MenuItem>
                        {Object.entries(LeagueOptions).map(
                          ([l, leagueName], idx) => (
                            <MenuItem key={idx} value={l}>
                              {leagueName}
                            </MenuItem>
                          )
                        )}
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
              <KBarPortal>
                <KBarPositioner style={{ zIndex: 1 }}>
                  <KBarAnimator
                    style={{
                      zIndex: 9999,
                      borderRadius: "0.25rem",
                      position: "absolute",
                      margin: "4rem",
                      width: "80%",
                      maxWidth: "600px",
                    }}
                  >
                    <Paper elevation={12}>
                      <KBarInput />
                      <Results darkMode={darkMode} />
                    </Paper>
                  </KBarAnimator>
                </KBarPositioner>
              </KBarPortal>
            </KBarProvider>
          </DarkMode.Provider>
        </ThemeProvider>
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
  const [league, setLeague] = useState<Results.Leagues>();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (router.pathname === "/") {
      setLeague("mls");
    } else {
      setLeague(String(router.query.league) as Results.Leagues);
    }
  }, [router.isReady, router.query, router.pathname, setLeague]);
  return league ? <MLSFormGuide {...props} league={league} /> : <></>;
}

MLSFormGuide.getStaticProps = async (ctx: AppContext) => {
  return { league: ctx.router.query?.league ?? "mls" };
};
