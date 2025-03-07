import {
  AppBar,
  Autocomplete,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  KeyboardCommandKey,
  KeyboardControlKey,
  Menu as MenuIcon,
  Search,
} from "@mui/icons-material";
import EasterEggContext from "../Context/EasterEgg";
import { useContext } from "react";
import LeagueContext from "../Context/League";
import { useRouter } from "next/router";
import { LeagueOptions } from "@/utils/Leagues";
import DrawerContext from "../Context/Drawer";
import YearContext from "../Context/Year";

export default function Bar({
  onSetDrawerOpen,
  onSetLeague,
  onSetYear,
}: {
  onSetDrawerOpen: (open: boolean) => void;
  onSetLeague: (league: Results.Leagues) => void;
  onSetYear: (year: number) => void;
}) {
  const easterEgg = useContext(EasterEggContext);
  const league = useContext(LeagueContext);
  const year = useContext(YearContext);
  const open = useContext(DrawerContext);
  const router = useRouter();
  return (
    <AppBar>
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => onSetDrawerOpen(open ? false : true)}
          edge="start"
          sx={{ ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          The Form Guide{easterEgg ? "!!" : ""}
        </Typography>
        <Box
          sx={{
            alignContent: "center",
            fontWeight: "bold",
            display: "inline-flex",
          }}
        >
          <Search
            sx={{ cursor: "pointer", position: "relative", top: "4px" }}
            onClick={() =>
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  code: "KeyK",
                  key: "k",
                  metaKey: true,
                }),
              )
            }
          />
          <Box sx={{ display: { xs: "none", md: "inline" } }}>
            : {"("}
            <KeyboardCommandKey
              sx={{ position: "relative", top: "4px" }}
            /> or{" "}
            <KeyboardControlKey sx={{ position: "relative", top: "4px" }} />
            {")"}
            +K
          </Box>
        </Box>
        <Select
          sx={{
            backgroundColor: "background.paper",
            display: { xs: "none", md: "inline" },
          }}
          value={year}
          onChange={(ev) => onSetYear(Number(ev.target.value))}
        >
          <MenuItem value={2025}>2025</MenuItem>
          <Divider />
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2023}>2023</MenuItem>
          <MenuItem value={2022}>2022</MenuItem>
          <MenuItem value={2012}>2012</MenuItem>
          <MenuItem value={2013}>2013</MenuItem>
          <MenuItem value={2014}>2014</MenuItem>
          <MenuItem value={2015}>2015</MenuItem>
          <MenuItem value={2016}>2016</MenuItem>
          <MenuItem value={2017}>2017</MenuItem>
          <MenuItem value={2018}>2018</MenuItem>
          <MenuItem value={2019}>2019</MenuItem>
          <MenuItem value={2020}>2020</MenuItem>
          <MenuItem value={2021}>2021</MenuItem>
        </Select>
        <Autocomplete
          options={Object.entries(LeagueOptions).map(([league, name]) => ({
            label: name,
            id: league,
          }))}
          sx={{
            width: 250,
            display: { xs: "none", md: "inline" },
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
          onChange={(ev, newValue) => {
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
      </Toolbar>
    </AppBar>
  );
}
