import "../styles/globals.css";
import NavStyles from "../styles/Nav.module.css";
import type { AppProps } from "next/app";
import Link from "next/link";

function MLSFormGuide({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className={NavStyles.Nav}>
        <span>
          <Link href="/">2021 Form Guide</Link>
        </span>
        <span>
          <Link href="/chart">Chart</Link>
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
    </div>
  );
}
export default MLSFormGuide;
