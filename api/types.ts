export type InPlayResponse = {
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

export type typeOddsResponse = {
  success: number;
};
