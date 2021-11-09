export type MatchesListApiResponse = {
  success: number;
  pager: {
    page: number;
    per_page: number;
    total: number;
  };
  results: {
    id: string;
    sport_id: string;
    time: string;
    time_status: string;
    league: {
      id: string;
      name: string;
      cc: string | null;
    };
    home: {
      id: string;
      name: string;
      image_id: number;
      cc: string | null;
    };
    away: {
      id: string;
      name: string;
      image_id: number;
      cc: string | null;
    };
    ss: string;
    points: string;
    playing_indicator: string;
    scores: {
      [key: string]: {
        home: string;
        away: string;
      };
    };
    bet365_id: string;
  }[];
};

export type MatchApiResponse = {
  success: number;
  results: {
    id: string;
    sport_id: string;
    time: string;
    time_status: string;
    league: {
      id: string;
      name: string;
      cc: string;
    };
    home: {
      id: string;
      name: string;
      image_id: number;
      cc: string | null;
    };
    away: {
      id: string;
      name: string;
      image_id: number;
      cc: string | null;
    };
    ss: string;
    points: string;
    playing_indicator: string;
    scores: {
      [key: string]: {
        home: string;
        away: string;
      };
    };
    stats: {
      aces: string[];
      double_faults: string[];
      win_1st_serve: string[];
      break_point_conversions: string[];
    };
    events: {
      id: string;
      text: string;
    }[];
    extra?: string[];
    bet365_id: string;
    inplay_created_at: string;
    inplay_updated_at: string;
  }[];
};

export type typeOddsResponse = {
  success: number;
};

export type MatchType = 'live' | 'upcoming';
