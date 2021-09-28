import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link, { LinkProps } from "next/link";
import {
  Box,
  Button,
  ButtonProps,
  Divider,
  Link as MLink,
  ListItem,
  CssBaseline,
  ListItemProps,
  AppBar,
  Toolbar,
  IconButton,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";

import { Menu as MenuIcon } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
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

  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  return (
    <ThemeProvider theme={theme}>
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
  );
}
