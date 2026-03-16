"use client";

import React, { useState, Suspense } from "react";
import {
  Box,
  CssBaseline,
  Link as MLink,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  CircularProgress,
  // Paper,
} from "@mui/material";
import { blueGrey, deepOrange, deepPurple } from "@mui/material/colors";
import { useParams, usePathname } from "next/navigation";
// import { KBarAnimator, KBarPortal, KBarPositioner } from "@refinedev/kbar";
import useCookie from "react-use-cookie";

import Nav from "@/components/Nav";
import YearContext, { DEFAULT_YEAR } from "@/components/Context/Year";
import LeagueContext, { DEFAULT_LEAGUE } from "@/components/Context/League";
import KBarProviderTemp from "@/components/KBar/ProviderTemp";
// import Results from "@/components/Results";
import DarkMode from "@/components/Context/DarkMode";
// import KBarInput from "@/components/KBar/Input";
import { useEasterEgg } from "@/components/EasterEgg";
import Bar from "@/components/App/Bar";
import DrawerContext from "@/components/Context/Drawer";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkModeCookie, setDarkMode] = useCookie("dark-mode", "");
  const darkMode =
    darkModeCookie === "dark" ||
    (darkModeCookie !== "light" && prefersDarkMode);
  const [year, setYear] = useState<number>(DEFAULT_YEAR);
  const { easterEgg, renderComponent } = useEasterEgg();

  // Determine league from path
  const league = React.useMemo(() => {
    if (pathname === "/") {
      return "mls" as Results.Leagues;
    }
    return (params?.league as Results.Leagues) ?? DEFAULT_LEAGUE;
  }, [pathname, params?.league]);

  const [_league, setLeague] = useState<Results.Leagues>(league);
  const [drawerOpen, setDrawerOpen] = useCookie("drawer-open", "closed");

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
          primary: {
            light: deepOrange["50"],
            dark: deepOrange["900"],
            main: easterEgg
              ? deepPurple["300"]
              : darkMode
                ? deepOrange["50"]
                : deepOrange["700"],
          },
          secondary: {
            light: deepPurple["100"],
            main: deepPurple["500"],
            dark: deepPurple["800"],
            contrastText: "white",
          },
          success: {
            main: "#4ec961",
          },
          warning: {
            main: "#fed263",
          },
          error: {
            main: "#E48888",
          },
          background: {
            default: darkMode ? blueGrey["800"] : blueGrey["50"],
          },
        },
      }),
    [darkMode, easterEgg],
  );

  // Sync internal league state with route-based league
  React.useEffect(() => {
    setLeague(league);
  }, [league]);

  return (
    <YearContext.Provider value={year}>
      <LeagueContext.Provider value={_league}>
        <DrawerContext.Provider value={drawerOpen === "open" ? true : false}>
          <CssBaseline />
          {renderComponent()}

          <ThemeProvider theme={theme}>
            <DarkMode.Provider value={darkMode}>
              <KBarProviderTemp onSetLeague={(league) => setLeague(league)}>
                <Box
                  sx={{
                    minHeight: "100vh",
                    position: "relative",
                    display: "grid",
                    gridTemplateRows: "1fr max-content",
                  }}
                >
                  <Nav
                    drawerOpen={drawerOpen === "open"}
                    league={_league}
                    setDarkMode={(darkMode) =>
                      setDarkMode(darkMode ? "dark" : "light")
                    }
                    darkMode={darkMode}
                    onCloseDrawer={() => setDrawerOpen("closed")}
                    onOpenDrawer={() => setDrawerOpen("open")}
                    onSetLeague={setLeague}
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
                    <Suspense fallback={<CircularProgress />}>
                      <Bar
                        onSetDrawerOpen={(open) =>
                          setDrawerOpen(open ? "open" : "closed")
                        }
                        onSetLeague={setLeague}
                        onSetYear={setYear}
                      />
                    </Suspense>
                    <Box sx={{ marginTop: 8 }}>
                      {children}
                    </Box>
                  </Box>
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
                {/* <KBarPortal>
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
                </KBarPortal> */}
              </KBarProviderTemp>
            </DarkMode.Provider>
          </ThemeProvider>
        </DrawerContext.Provider>
      </LeagueContext.Provider>
    </YearContext.Provider>
  );
}