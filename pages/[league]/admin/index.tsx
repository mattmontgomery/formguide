import BaseDataPage from "@/components/BaseDataPage";
import fetcher from "@/utils/fetcher";
import getAllFixtureIds from "@/utils/getAllFixtureIds";
import { SportsSoccer, SportsSoccerTwoTone } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import useSWR from "swr";

let IS_ADMIN = false;

if (process.env.NODE_ENV === "development") {
  IS_ADMIN = true;
}
export default function Admin() {
  const { data: fixturesData } = useSWR<FormGuideAPI.BaseAPIV2<number[]>>(
    `/api/admin/all-fixtures`,
    fetcher
  );
  const [loadFixture, setLoadFixture] = useState<number[]>([]);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await fetch(
        `/api/admin/load-fixtures?${loadFixture
          .map((fixture) => `fixtureIds=${fixture}`)
          .join("&")}`
      );
      setLoaded([...loaded, ...loadFixture]);
      setLoadFixture([]);
      setLoading(false);
    }
    if (loadFixture.length) {
      loadData();
    }
  }, [loadFixture, loaded]);
  const [sliceSize] = useState<number>(25);

  if (!IS_ADMIN) {
    return <></>;
  }
  return (
    <BaseDataPage
      renderComponent={(data) => {
        const fixtureIds = getAllFixtureIds(data);
        const remaining = fixtureIds
          .map((match) => match.fixtureId)
          .filter(
            (f) => !(loaded.includes(f) || fixturesData?.data?.includes(f))
          );
        return (
          <Box sx={{ maxWidth: 800 }}>
            <Button
              sx={{ width: "100%", height: 40 }}
              disabled={loading}
              variant="contained"
              onClick={() => {
                setLoadFixture(remaining.slice(0, sliceSize));
              }}
            >
              {loading ? (
                <CircularProgress size={16} />
              ) : (
                `Load next ${sliceSize}, `
              )}
              {remaining.length} left
            </Button>
            <List>
              {fixtureIds.map((match, idx) => {
                return (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      {fixturesData?.data?.includes(match.fixtureId) ? (
                        <SportsSoccer />
                      ) : loaded.includes(match.fixtureId) ? (
                        <SportsSoccerTwoTone />
                      ) : (
                        ""
                      )}
                    </ListItemIcon>
                    <ListItemButton
                      onClick={() =>
                        setLoadFixture([...loadFixture, match.fixtureId])
                      }
                    >
                      {match.title}
                    </ListItemButton>
                    <ListItemSecondaryAction>
                      <a href={`/fixtures/${match.fixtureId}`}>Link</a>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        );
      }}
      pageTitle="Admin Fixture Loader"
    ></BaseDataPage>
  );
}
