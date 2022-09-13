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
import Nav, { DRAWER_WIDTH } from "@/components/Nav";
import YearContext, { DEFAULT_YEAR } from "@/components/YearContext";
import LeagueContext, { DEFAULT_LEAGUE } from "@/components/LeagueContext";
import EasterEggContext from "@/components/EasterEggContext";
import { useRouter } from "next/router";
import { KBarAnimator, KBarPortal, KBarPositioner, KBarSearch } from "kbar";
import KBarProvider from "@/components/KBarProvider";
import Results from "@/components/Results";

import useCookie from "react-use-cookie";
import { LeagueOptions } from "@/utils/Leagues";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
  "Enter",
];

export function MLSFormGuide({
  Component,
  league,
  pageProps,
}: AppProps & { league: Results.Leagues }): React.ReactElement {
  const router = useRouter();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState<boolean>(prefersDarkMode);
  const [year, setYear] = useState<number>(DEFAULT_YEAR);
  const [easterEgg, setEasterEgg] = useState<boolean>(false);
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
        palette: {
          mode: darkMode ? "dark" : "light",
          ...(easterEgg
            ? {
                primary: {
                  main: "#8cca7a",
                },
              }
            : {}),
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
    [darkMode, easterEgg]
  );

  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      setKonamiCode([...konamiCode, ev.key]);
    };
    document.addEventListener("keyup", listener);
    return () => {
      document.removeEventListener("keyup", listener);
    };
  }, [konamiCode]);
  useEffect(() => {
    if (easterEgg) {
      return;
    }
    if (
      konamiCode.map((k, i) => k === KONAMI_CODE[i]).some((v) => v === false)
    ) {
      setKonamiCode([]);
    } else if (konamiCode.length === KONAMI_CODE.length) {
      setEasterEgg(true);
    } else {
      setEasterEgg(false);
    }
  }, [konamiCode, setKonamiCode, easterEgg, setEasterEgg]);

  return (
    <YearContext.Provider value={year}>
      <LeagueContext.Provider value={_league}>
        <EasterEggContext.Provider value={easterEgg}>
          <ThemeProvider theme={theme}>
            <KBarProvider onSetLeague={(league) => setLeague(league)}>
              <KBarPortal>
                <KBarPositioner style={{ zIndex: 1 }}>
                  <KBarAnimator
                    style={{
                      zIndex: 9999,
                      borderRadius: "0.25rem",
                      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                      position: "absolute",
                      width: "80%",
                      maxWidth: "600px",
                      minHeight: "400px",
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
                <meta title="MLS, NWSL and More | Soccer Form Guide" />
                <meta
                  name="description"
                  content="A tool to replace the old MLS Form Guide that mlssoccer.com retired"
                />
                <link rel="canonical" href="https://formguide.tools.football" />
              </Head>
              <Box sx={{ display: "flex", position: "relative" }}>
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
                          setDrawerOpen(
                            drawerOpen === "open" ? "closed" : "open"
                          )
                        }
                        edge="start"
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        Form Guide (2012–present){easterEgg ? "!!" : ""}
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
            </KBarProvider>
          </ThemeProvider>
        </EasterEggContext.Provider>
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
