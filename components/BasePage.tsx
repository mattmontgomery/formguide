import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { Divider, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import YearContext from "./YearContext";
import LeagueContext from "./LeagueContext";
import { Box } from "@mui/system";

export default function BasePage({
  pageTitle,
  children,
}: {
  pageTitle: string;
  children?: React.ReactNode;
}): React.ReactElement {
  const year = useContext(YearContext);
  const league = useContext(LeagueContext);
  return (
    <div className={styles.body}>
      <Head>
        <title>
          Form Guide | 2012–2022 | {pageTitle} | Data for {league} in {year}
        </title>
      </Head>
      <Box paddingBottom={2}>
        <Grid container>
          <Grid md={8} item paddingBottom={1}>
            {pageTitle && <Typography variant="h4">{pageTitle}</Typography>}
          </Grid>
          <Grid md={4} item sx={{ textAlign: "right" }}>
            {year}:{league}
          </Grid>
          <Grid xs={12} item>
            <Divider />
          </Grid>
          <Grid xs={12} item>
            <Box paddingTop={2}>{children}</Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
