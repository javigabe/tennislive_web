export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type LeagueName = 'ATP' | 'UTR' | 'ITF' | 'WTA' | 'CHALLENGER';
export type League = Record<TournamentName, Tournament>;
export type TournamentName = string;
export type Tournament = Match[];

export type Match = {
  id: string;
  player1: Player;
  player2: Player;
  live: boolean;
  league: LeagueName;
  tournament: string;
  time: string;
  scoreboard: Scoreboard | null;
  odds?: Odd;
  sets: MatchSet | null;
  events?: MatchEvent[];
  extra: string[];
  stats: MatchStats | null;
};

export type Mto = {
  player: string;
  date: string;
  text: string;
  game: string;
};

export type Odd = {
  odds1: string;
  odds2: string;
};

export type Player = {
  name: string;
  img_url: string;
  mtos: Mto[] | null;
};

export type Scoreboard = {
  sets: Set;
  games: Game;
};

export type Set = {
  sets1: number;
  sets2: number;
};

export type Game = {
  games1: string;
  games2: string;
};

export type Score = {
  home: string;
  away: string;
};

export type MatchSet = {
  [key: string]: Score;
};

export type MatchEvent = {
  id: string;
  text: string;
};

export type MatchStats = {
  aces: string[];
  double_faults: string[];
  win_1st_serve: string[];
  break_point_conversions: string[];
};
