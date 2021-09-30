import "../styles/globals.css";

import Head from "next/head";
import type { AppProps } from "next/app";
import Link, { LinkProps } from "next/link";
import {
  AppBar,
  Box,
  Button,
  ButtonProps,
  Divider,
  CssBaseline,
  IconButton,
  Link as MLink,
  ListItem,
  ListItemProps,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";

import { Menu as MenuIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import { useRouter } from "next/router";
import YearContext, { DEFAULT_YEAR } from "../components/YearContext";

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
          success: {
            main: "#8cca7a",
          },
          warning: {
            main: "#f9c389",
          },
          error: {
            main: "#f3968f",
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

  const [year, setYear] = useState<number>(DEFAULT_YEAR);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  return (
    <YearContext.Provider value={year}>
      <ThemeProvider theme={theme}>
        <Head>
          <meta title="MLS Form Guide 2021" />
          <meta
            name="description"
            content="A tool to replace the old MLS Form Guide that mlssoccer.com retired"
          />
          <meta />
        </Head>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Nav
            drawerOpen={drawerOpen}
            setDarkMode={setDarkMode}
            darkMode={darkMode}
          />
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
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  MLS Form Guide (2012–2021)
                </Typography>
                <Select
                  value={year}
                  onChange={(ev) => setYear(Number(ev.target.value))}
                >
                  <MenuItem value={2021}>2021</MenuItem>
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
    </YearContext.Provider>
  );
}
