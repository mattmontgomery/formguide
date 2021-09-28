import React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemProps,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Link from "next/link";

import {
  TableChart,
  BarChart,
  SportsSoccerSharp,
  SportsSoccerTwoTone,
  SportsSoccerRounded,
} from "@mui/icons-material";

const ListItemLink = React.forwardRef<ListItemProps, any>(
  ({ href, as, ...props }, ref) => {
    return (
      <Link href={href} as={as} passHref>
        <ListItem button ref={ref} {...props} />
      </Link>
    );
  }
);
ListItemLink.displayName = "ListItemLink";
const DRAWER_WIDTH = 240;
export default function Nav({
  drawerOpen = true,
  darkMode,
  setDarkMode = () => null,
}: {
  drawerOpen: boolean;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}): React.ReactElement {
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
      variant={drawerOpen ? "permanent" : "temporary"}
      anchor="left"
    >
      <Box sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <List>
          <ListItemLink href="/">
            <ListItemIcon>
              <TableChart />
            </ListItemIcon>
            <ListItemText>Form Guide</ListItemText>
          </ListItemLink>
          <Divider />
          <ListSubheader>Rolling Charts</ListSubheader>
          <ListItemLink href="/chart/3">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText>3-game</ListItemText>
          </ListItemLink>
          <ListItemLink href="/chart/5">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText>5-game</ListItemText>
          </ListItemLink>
          <ListItemLink href="/chart/8">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText>8-game</ListItemText>
          </ListItemLink>
          <ListItemLink href="/chart/11">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText>11-game</ListItemText>
          </ListItemLink>
          <Divider />
          <ListSubheader>Goal Difference</ListSubheader>
          <ListItemLink href="/gd">
            <ListItemIcon>
              <SportsSoccerRounded />
            </ListItemIcon>
            <ListItemText>GD</ListItemText>
          </ListItemLink>
          <ListItemLink href="/gd/cumulative">
            <ListItemIcon>
              <SportsSoccerRounded />
            </ListItemIcon>
            <ListItemText>Cumulative</ListItemText>
          </ListItemLink>
          <ListItemLink href="/gd-chart/3">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText>Rolling 3-game</ListItemText>
          </ListItemLink>
          <ListItemLink href="/gd-chart/5">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText>Rolling 5-game</ListItemText>
          </ListItemLink>
          <ListItemLink href="/gd-chart/8">
            <ListItemIcon>
              <BarChart />
            </ListItemIcon>
            <ListItemText>Rolling 8-game</ListItemText>
          </ListItemLink>
          <Divider />
          <ListSubheader>Goals For</ListSubheader>
          <ListItemLink href="/gf">
            <ListItemIcon>
              <SportsSoccerSharp />
            </ListItemIcon>
            <ListItemText>GF</ListItemText>
          </ListItemLink>
          <ListItemLink href="/gf/cumulative">
            <ListItemIcon>
              <SportsSoccerSharp />
            </ListItemIcon>
            <ListItemText>Cumulative</ListItemText>
          </ListItemLink>
          <Divider />
          <ListSubheader>Goals Against</ListSubheader>
          <ListItemLink href="/ga">
            <ListItemIcon>
              <SportsSoccerTwoTone />
            </ListItemIcon>
            <ListItemText>GA</ListItemText>
          </ListItemLink>
          <ListItemLink href="/ga/cumulative">
            <ListItemIcon>
              <SportsSoccerTwoTone />
            </ListItemIcon>
            <ListItemText>Cumulative</ListItemText>
          </ListItemLink>
          <Divider />
          <ListSubheader>PPG/Strength of Schedule</ListSubheader>
          <ListItemLink href="/ppg/opponent">
            <ListItemIcon>
              <SportsSoccerSharp />
            </ListItemIcon>
            <ListItemText>Opponent PPG by match</ListItemText>
          </ListItemLink>
          <ListItemLink href="/ppg/team">
            <ListItemIcon>
              <SportsSoccerSharp />
            </ListItemIcon>
            <ListItemText>Team PPG by match</ListItemText>
          </ListItemLink>
          <ListItemLink href="/ppg/team">
            <ListItemIcon>
              <SportsSoccerSharp />
            </ListItemIcon>
            <ListItemText>Expected outcome by match</ListItemText>
          </ListItemLink>
          <Divider />
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(event) => setDarkMode(event.target.checked)}
                />
              }
              label="Dark Mode"
            />
          </ListItem>
          <Divider />
          <ListItemLink href="https://lineup.tools.football">
            <ListItemText>Lineup Graphic Builder</ListItemText>
          </ListItemLink>
        </List>
      </Box>
    </Drawer>
  );
}
