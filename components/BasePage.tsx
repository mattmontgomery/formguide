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
  renderTitle?: () => React.ReactNode;
  renderControls?: () => React.ReactNode;
} & React.PropsWithChildren;

export default function BasePage({
  children,
  pageTitle,
  renderControls,
  renderTitle,
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
          <Typography variant="overline">
            Year: {year}, League: {LeagueOptions[league]}
          </Typography>
          {typeof renderTitle === "function" ? (
            <Typography variant="h4">{renderTitle()}</Typography>
          ) : pageTitle ? (
            <Typography variant="h4">{pageTitle}</Typography>
          ) : (
            <></>
          )}
        </Box>
        <hr
          style={{
            borderColor: "goldenrod",
            borderWidth: "1.5px",
            borderStyle: "solid",
            marginBottom: "1rem",
          }}
        />
        {renderControls && (
          <Paper
            elevation={25}
            sx={{
              padding: 2,
              fontSize: "85%",
              alignContent: "center",
              marginBottom: "2rem",
            }}
          >
            <Grid direction="row" container columnGap={4}>
              {renderControls()}
            </Grid>
          </Paper>
        )}
        <Paper elevation={25} sx={{ padding: 2 }}>
          {children}
        </Paper>
      </div>
    </>
  );
}
