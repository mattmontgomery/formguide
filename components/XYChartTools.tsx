import { getTeamColor } from "@/utils/Leagues";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { LegendOrdinal } from "@visx/legend";
import { AxisScale, DataContext, LineSeries } from "@visx/xychart";
import { BaseLineSeriesProps } from "@visx/xychart/lib/components/series/private/BaseLineSeries";
import React, { useContext, useState } from "react";

export function useChartLegend(teams: string[]) {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [hoverTeam, setHoverTeam] = useState<string | null>();

  const renderComponent = (showTeams?: string[]) => (
    <ChartLegend
      onSelectTeam={(team) =>
        setSelectedTeams(
          selectedTeams.includes(team)
            ? selectedTeams.filter((t) => t !== team)
            : [...selectedTeams, team]
        )
      }
      onHoverTeam={setHoverTeam}
      selectedTeams={selectedTeams}
      allTeams={showTeams ? showTeams : teams}
    />
  );

  return {
    selectedTeams,
    setSelectedTeams,
    hoverTeam,
    setHoverTeam,
    renderComponent,
  };
}

export function getColor({
  team,
  colorScale,
}: {
  team: string;
  colorScale: unknown;
}): string {
  const teamColor = getTeamColor(team);
  if (teamColor) {
    return teamColor;
  } else if (typeof colorScale === "function") {
    return colorScale(team);
  } else {
    return "#dddddd";
  }
}

export function ChartLegend({
  onSelectTeam,
  onHoverTeam,
  selectedTeams = [],
  allTeams = [],
}: {
  onHoverTeam: (team: string | null) => void;
  onSelectTeam: (team: string) => void;
  selectedTeams: string[];
  allTeams: string[];
}): React.ReactElement {
  const { colorScale } = useContext(DataContext);
  return colorScale ? (
    <LegendOrdinal
      direction="column"
      itemMargin="8px 8px 8px 0"
      scale={colorScale}
      labelFormat={(label: string) => label}
      legendLabelProps={{ color: "white" }}
      shape="line"
      style={{
        marginTop: -24,
        display: "flex", // required in addition to `direction` if overriding styles
      }}
    >
      {(labels) => {
        return allTeams.sort().map((team, idx) => {
          const l = labels.find((label) => label.text === team);
          return (
            <React.Fragment key={idx}>
              <FormControlLabel
                onMouseEnter={() => onHoverTeam(team)}
                onMouseLeave={() => onHoverTeam(null)}
                control={
                  <Checkbox
                    checked={selectedTeams.includes(team)}
                    onChange={() => onSelectTeam(team)}
                  />
                }
                label={
                  <Box
                    sx={{
                      borderBottomColor: l
                        ? getColor({ team: l.text, colorScale })
                        : "#ddd",
                      borderBottomWidth: 4,
                      borderBottomStyle: "solid",
                    }}
                  >
                    {team}
                  </Box>
                }
              />
            </React.Fragment>
          );
        });
      }}
    </LegendOrdinal>
  ) : (
    <>whoops!</>
  );
}

export function TeamLineSeries(
  props: BaseLineSeriesProps<AxisScale, AxisScale, Record<string, unknown>> & {
    focused: boolean;
  }
) {
  const { colorScale } = useContext(DataContext);
  const { focused, ...lineSeriesProps } = props;
  return (
    <LineSeries
      {...lineSeriesProps}
      strokeWidth={focused ? 8 : 2}
      stroke={getColor({ team: props.dataKey, colorScale })}
    />
  );
}
