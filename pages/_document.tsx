import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5R51KL2GNN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-5R51KL2GNN');`}
        </Script>
        <link rel="shortcut icon" href="/ball.png" />
        <meta property="og:title" content="The Form Guide" />
        <meta property="og:image" content="/ball.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
