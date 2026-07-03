export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
}

export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  status: string;
  total_rosters: number;
  scoring_settings: Record<string, number>;
  draft_id: string;
}

export interface SleeperPick {
  round: number;
  roster_id: number;
  player_id: string;
  picked_by: string;
  pick_no: number;
  draft_id: string;
  metadata?: Record<string, string>;
  is_keeper?: boolean | null;
}
