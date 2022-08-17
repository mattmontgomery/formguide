declare namespace ASA {
  type Endpoint = (year: string, league: string) => string;
  type GenericApi = FormGuideAPI.BaseAPI<[]>;
  type XgApi = FormGuideAPI.BaseAPI<XG[]>;
  type XPassApi = FormGuideAPI.BaseAPI<XG[]>;
  type XgByGameApi = FormGuideAPI.BaseAPI<{
    teams: Team[];
    xg: Record<string, (XGWithGame & HomeAway)[]>;
  }>;
  type XPassByGameApi = FormGuideAPI.BaseAPI<(WithGame & XPass)[]>;

  type WithGame = {
    game_id: string;
    date_time_utc: string;
  };
  type WithTeam = {
    team_id: string;
  };

  type Team = {
    team_id: string;
    team_name: string;
    team_short_name: string;
    team_abbreviation: string;
  };

  type XG = WithTeam & {
    count_games?: number;
    shots_for: number;
    shots_against: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    xgoals_for: number;
    xgoals_against: number;
    xgoal_difference: number;
    goal_difference_minus_xgoal_difference: number;
    points: number;
    xpoints: number;
  };
  type XGWithGame = WithGame & {
    home_team_id: string;
    away_team_id: string;
    home_goals: number;
    home_team_xgoals: number;
    home_player_xgoals: number;
    away_goals: number;
    away_team_xgoals: number;
    away_player_xgoals: number;
    home_xpoints: number;
    away_xpoints: number;
  };
  type HomeAway = {
    isHome: boolean;
    homeTeam: string;
    awayTeam: string;
  };
  type XPass = WithTeam & {
    count_games?: number;
    attempted_passes_for: number;
    pass_completion_percentage_for: number;
    xpass_completion_percentage_for: number;
    passes_completed_over_expected_for: number;
    passes_completed_over_expected_p100_for: number;
    avg_vertical_distance_for: number;
    attempted_passes_against: number;
    pass_completion_percentage_against: number;
    xpass_completion_percentage_against: number;
    passes_completed_over_expected_against: number;
    passes_completed_over_expected_p100_against: number;
    avg_vertical_distance_against: number;
    passes_completed_over_expected_difference: number;
    avg_vertical_distance_difference: number;
  };

  type Game = WithGame & {
    date_time_utc: string;
    home_score: number;
    away_score: number;
    home_team_id: string;
    away_team_id: string;
    referee_id: string;
    stadium_id: string;
    home_manager_id: string;
    away_manager_id: string;
    expanded_minutes: number;
    season_name: string;
    matchday: number;
    attendance: number;
    knockout_game: boolean;
    last_updated_utc: string;
  };

  type ValidStats =
    | "xpoints"
    | "for"
    | "against"
    | "difference"
    | "xpointsDifference";
}
