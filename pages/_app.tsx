import "../styles/globals.css";
import NavStyles from "../styles/Nav.module.css";
import type { AppProps } from "next/app";
import Link from "next/link";

function MLSFormGuide({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className={NavStyles.Nav}>
        <span>
          <Link href="/">Form Guide</Link>
        </span>
        <span>
          <span className={NavStyles.NavGroupLabel}>Rolling Chart</span>
          <Link href="/chart/3">3</Link>
          <Link href="/chart/5">5</Link>
          <Link href="/chart/8">8</Link>
          <Link href="/chart/11">11</Link>
        </span>
        <span>
          <Link href="/goal-difference">GD</Link>
        </span>
        <span>
          <Link href="/goals-for">GF</Link>
        </span>
        <span>
          <Link href="/goals-against">GA</Link>
        </span>
      </nav>
      <Component {...pageProps} />
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
          <strong>2021-09-13</strong>: Fixed Safari issue with date sorting.
          Added GD, GF, GA pages. Added options for more rolling-game charts.
        </p>
      </footer>
    </div>
  );
}
export default MLSFormGuide;
