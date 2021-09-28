import styles from "../styles/Home.module.css";
import Head from "next/head";
import { Typography } from "@mui/material";

export default function BasePage({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <div className={styles.body}>
      <Head>
        <title>MLS Form Guide 2021 | {pageTitle}</title>
      </Head>
      {pageTitle && <Typography variant="h4">{pageTitle}</Typography>}
      {children}
    </div>
  );
}
