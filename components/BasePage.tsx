import styles from "@/styles/Home.module.css";
import { Grid, Typography } from "@mui/material";
import { useContext } from "react";
import YearContext from "./Context/Year";
import LeagueContext from "./Context/League";
import { Box, Paper } from "@mui/material";
import { NextSeo } from "next-seo";
import { LeagueOptions } from "@/utils/Leagues";

export type BasePageProps = {
  pageTitle: React.ReactNode | string;
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
    <>
      <NextSeo
        title={`${
          pageTitle ?? "The Form Guide"
        } | Data for ${league} ${year} | The Form Guide`}
        description={`${
          pageTitle ?? "The Form Guide"
        } for ${league} and ${year}`}
      />
      <div className={styles.body}>
        <Box paddingBottom={2}>
          <Grid container rowGap={2}>
            <Grid xs={12} item>
              <Typography variant="overline">
                Year: {year}, League: {LeagueOptions[league]}
              </Typography>
              {pageTitle && <Typography variant="h4">{pageTitle}</Typography>}
            </Grid>
            {renderControls && (
              <Grid xs={12} item>
                <Paper
                  elevation={3}
                  sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                  }}
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
    </>
  );
}
