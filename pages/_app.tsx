import "../styles/globals.css";
import NavStyles from "../styles/Nav.module.css";
import type { AppProps } from "next/app";
import Link, { LinkProps } from "next/link";
import { Button, ButtonGroup, Toolbar, Box, ButtonProps } from "@mui/material";
import React from "react";

/**
 * We need to Omit from the MUI Button the {href} prop
 * as we have to handle routing with Next.js Router
 * so we block the possibility to specify an href.
 */

export type ButtonLinkProps = Omit<ButtonProps, "href" | "classes"> &
  Pick<LinkProps, "href" | "as" | "prefetch">;

const ButtonLink = React.forwardRef<ButtonLinkProps, any>(
  ({ href, as, prefetch, ...props }, ref) => (
    <Link href={href} as={as} prefetch={prefetch} passHref>
      <Button ref={ref} {...props} />
    </Link>
  )
);

ButtonLink.displayName = "ButtonLink";

function MLSFormGuide({ Component, pageProps }: AppProps): React.ReactElement {
  return (
    <div>
      <nav className={NavStyles.ExternalNav}>
        <strong>Soccer Blogger Tools</strong>
        <Link href="https://lineup.tools.football">Lineup Graphic Builder</Link>
        <Link href="https://formguide.tools.football">MLS Form Guide</Link>
      </nav>
      <Toolbar
        sx={{
          border: "1px solid #f0f0f0",
          borderWidth: "1px 0 1px 0",
        }}
      >
        <Box m={1}>
          <Button variant="outlined">
            <Link href="/">Form Guide</Link>
          </Button>
        </Box>
        <Box m={1}>
          <ButtonGroup>
            <ButtonLink href="/chart/3">Rolling 3</ButtonLink>
            <ButtonLink href="/chart/5">5</ButtonLink>
            <ButtonLink href="/chart/8">8</ButtonLink>
            <ButtonLink href="/chart/11">11</ButtonLink>
          </ButtonGroup>
        </Box>
        <Box m={1}>
          <ButtonLink variant="outlined" href="/goal-difference">
            GD
          </ButtonLink>
        </Box>
        <Box m={1}>
          <ButtonGroup>
            <ButtonLink variant="outlined" href="/goals-for">
              GF
            </ButtonLink>
            <ButtonLink variant="outlined" href="/goals-for-cumulative">
              Cumulative
            </ButtonLink>
          </ButtonGroup>
        </Box>
        <Box m={1}>
          <ButtonGroup>
            <ButtonLink variant="outlined" href="/goals-against">
              GA
            </ButtonLink>
            <ButtonLink variant="outlined" href="/goals-against-cumulative">
              Cumulative
            </ButtonLink>
          </ButtonGroup>
        </Box>
        <Box m={1}>
          <ButtonLink variant="outlined" href="/strength-of-schedule">
            PPG/Strength
          </ButtonLink>
        </Box>
      </Toolbar>
      <Box m={2}>
        <Component {...pageProps} />
      </Box>
      <footer className={NavStyles.Footer}>
        Created and maintained by{" "}
        <a href="https://twitter.com/thecrossbarrsl">Matt Montgomery</a>.{" "}
        <a href="https://github.com/mattmontgomery/formguide">
          Contribute on Github
        </a>
        . Something not working? Send me a tweet.
      </footer>
      <footer className={NavStyles.Changelog}>
        <p>
          <strong>2021-09-26</strong>: Added cumulative tables. Added
          header-clicking to sort given week.
        </p>
        <p>
          <strong>2021-09-17</strong>:{" "}
          {"Fixed match link. Added PPG/Strength page. You're welcome, Trevor."}
        </p>
        <p>
          <strong>2021-09-13</strong>:{" "}
          {
            "Fixed Safari issue with date sorting. Added GD, GF, GA pages. Added options for more rolling-game charts."
          }
        </p>
      </footer>
    </div>
  );
}
export default MLSFormGuide;
