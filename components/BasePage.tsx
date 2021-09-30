import styles from "../styles/Home.module.css";
import Head from "next/head";
import { Divider, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import YearContext from "./YearContext";
import { Box } from "@mui/system";

export default function BasePage({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const year = useContext(YearContext);
  return (
    <div className={styles.body}>
      <Head>
        <title>MLS Form Guide | 2012–2021 | {pageTitle}</title>
      </Head>
      <Box paddingBottom={2}>
        <Grid container>
          <Grid md={8} item>
            {pageTitle && <Typography variant="h4">{pageTitle}</Typography>}
          </Grid>
          <Grid md={4} item sx={{ textAlign: "right" }}>
            {year}
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box paddingTop={2}>{children}</Box>
    </div>
  );
}
