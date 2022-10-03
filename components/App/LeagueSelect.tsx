import { LeagueOptions } from "@/utils/Leagues";
import { Autocomplete, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { NavProps } from "../Nav";

export default function LeagueSelect({
  league,
  onSetLeague,
}: {
  league: Results.Leagues;
  onSetLeague: NavProps["onSetLeague"];
}) {
  const router = useRouter();
  return (
    <Autocomplete
      options={Object.entries(LeagueOptions).map(([league, name]) => ({
        label: name,
        id: league,
      }))}
      sx={{
        width: "100%",
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select a League"
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 1,
          }}
          variant="outlined"
        />
      )}
      value={{ id: league, label: LeagueOptions[league] }}
      onChange={(_, newValue) => {
        if (newValue) {
          onSetLeague(String(newValue.id) as Results.Leagues);
          router.push({
            pathname: router.pathname,
            query: {
              ...router.query,
              league: String(newValue.id),
            },
          });
        }
      }}
    />
  );
}
