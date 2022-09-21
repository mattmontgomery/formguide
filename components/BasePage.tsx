import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { Grid, Typography } from "@mui/material";
import { useContext } from "react";
import YearContext from "./YearContext";
import LeagueContext from "./LeagueContext";
import { Box, Paper } from "@mui/material";

export type BasePageProps = {
  pageTitle: string;
  renderControls?: () => React.ReactNode;
} & React.PropsWithChildren;

export default function BasePage({
  pageTitle,
  children,
  renderControls,
}: BasePageProps): React.ReactElement {
  const year = useContext(YearContext);
  const league = useContext(LeagueContext);
  return (
    <div className={styles.body}>
      <Head>
        <title>
          {pageTitle} | Data for {league} {year} | The Form Guide
        </title>
        <meta content={`${pageTitle} | The Form Guide`} property="og:title" />
        <meta
          content={`${pageTitle} for ${league} and ${year}`}
          property="og:description"
        />
      </Head>
      <Box paddingBottom={2}>
        <Grid container rowGap={2}>
          <Grid md={8} item paddingBottom={1}>
            {pageTitle && <Typography variant="h4">{pageTitle}</Typography>}
          </Grid>
          <Grid md={4} item sx={{ textAlign: "right" }}>
            {year}:{league}
          </Grid>
          {renderControls && (
            <Grid xs={12} item>
              <Paper
                elevation={3}
                sx={{ padding: 2, display: "flex", flexDirection: "row" }}
              >
                {renderControls()}
              </Paper>
            </Grid>
          )}
          <Grid xs={12} item>
            <Paper elevation={1} sx={{ padding: 2 }}>
              {children}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
