export type MatchInfo = {
  //match: Match;
  [key: string]: object[];
};

export type Player = {
  name: string;
  img_url: string;
};

export type Scoreboard = Record<string, Score>;

export type Score = {
  home: number;
  away: number;
};

export type MatchSet = {
  [key: string]: object[];
};

export type MatchEvent = {
  id: string;
  text: string;
};

export type Match = {
  id: string;
  player1: Player;
  player2: Player;
  league: string;
  tournament: string;
  scoreboard: Scoreboard;
  sets: MatchSet[];
  events: MatchEvent[];
};
