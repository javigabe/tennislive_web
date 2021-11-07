import {
  Game,
  League,
  LeagueName,
  Match,
  Odd,
  PartialRecord,
  Scoreboard,
  Set,
} from '../utils/types';
import { MatchApiResponse, MatchesListApiResponse } from './types';

const API_BASE_URL = 'https://api.b365api.com';

export default class B365Api {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  getEnabledTournaments(): LeagueName[] {
    return ['ATP', 'WTA', 'CHALLENGER', 'UTR'];
  }

  async getLiveMatchStats(matchId: string): Promise<Match> {
    const apiCall = await fetch(
      `${API_BASE_URL}/v1/event/view?token=${this.token}&event_id=${matchId}`
    );

    const apiCallResult = (await apiCall.json()) as MatchApiResponse;
    const match = apiCallResult.results[0];

    // TODO: HACER QUE SI NO ENCUENTRA UNO DE LOS ELEMENTOS NO SE ROMPA
    const my_match: Match = {
      id: match.id,
      player1: {
        name: match.home.name,
        img_url: '',
      },
      player2: {
        name: match.away.name,
        img_url: '',
      },
      live: true,
      league: match.league.name.split(' ')[0].toUpperCase() as LeagueName,
      tournament: match.league.name,
      time: convertFromEpoch(match.time),
      scoreboard: getScoreboard(match),
      sets: match.scores,
      events: match.events,
      extra: [],
      stats: null,
    };

    if (match.extra !== undefined) {
      my_match.extra = match.extra;
    }

    if (match.stats !== undefined) {
      my_match.stats = match.stats;
    }

    return my_match;
  }

  async getAllLiveMatchesId(): Promise<string[]> {
    const apiCall = await fetch(`${API_BASE_URL}/v1/events/inplay?sport_id=13&token=${this.token}`);
    const apiCallResult = await apiCall.json();

    const ids: string[] = [];

    apiCallResult.results.map((match: Match) => {
      ids.push(match.id);
    });

    return ids;
  }

  async getLiveTournaments(): Promise<PartialRecord<LeagueName, League>> {
    const apiCall = await fetch(`${API_BASE_URL}/v1/events/inplay?sport_id=13&token=${this.token}`);
    const apiCallResult = (await apiCall.json()) as MatchesListApiResponse;

    const matches = apiCallResult.results
      .filter((result) => {
        return this.extractLeagueName(result.league.name) !== 'ITF';
      })
      .map(async (match): Promise<Match> => {
        return {
          id: match.id,
          player1: { name: match.home.name, img_url: ' ' },
          player2: { name: match.away.name, img_url: ' ' },
          league: match.league.name.split(' ')[0].toUpperCase() as LeagueName,
          tournament: match.league.name,
          time: convertFromEpoch(match.time),
          live: true,
          scoreboard: getScoreboard(match),
          odds: await this.getMatchOdds(match.id),
          extra: [],
          stats: null,
          sets: null,
        };
      });

    const leagues: PartialRecord<LeagueName, League> = {};

    for await (const match of matches) {
      leagues[match.league] = leagues[match.league] || {};
      leagues[match.league]![match.tournament] = leagues[match.league]![match.tournament] || [];
      leagues[match.league]![match.tournament].push(match);
    }

    const ordered = Object.keys(leagues)
      .sort(sortMatches)
      .reduce<PartialRecord<LeagueName, League>>((obj, key) => {
        obj[key as LeagueName] = leagues[key as LeagueName];
        return obj;
      }, {});

    return ordered;
  }

  async getUpcomingTournaments(): Promise<PartialRecord<LeagueName, League>> {
    const apiCall = await fetch(
      `${API_BASE_URL}/v3/events/upcoming?sport_id=13&token=${this.token}`
    );
    const apiCallResult = (await apiCall.json()) as MatchesListApiResponse;

    const matches = apiCallResult.results
      .filter((result) => {
        return this.extractLeagueName(result.league.name) !== 'ITF';
      })
      .map(async (match): Promise<Match> => {
        return {
          id: match.id,
          player1: { name: match.home.name, img_url: ' ' },
          player2: { name: match.away.name, img_url: ' ' },
          league: match.league.name.split(' ')[0].toUpperCase() as LeagueName,
          tournament: match.league.name,
          time: convertFromEpoch(match.time),
          live: false,
          odds: await this.getMatchOdds(match.id),
          stats: null,
          extra: [],
          sets: null,
        };
      });

    const leagues: PartialRecord<LeagueName, League> = {};

    for await (const match of matches) {
      leagues[match.league] = leagues[match.league] || {};
      leagues[match.league]![match.tournament] = leagues[match.league]![match.tournament] || [];
      leagues[match.league]![match.tournament].push(match);
    }

    const ordered = Object.keys(leagues)
      .sort(sortMatches)
      .reduce<PartialRecord<LeagueName, League>>((obj, key) => {
        obj[key as LeagueName] = leagues[key as LeagueName];
        return obj;
      }, {});

    return ordered;
  }

  async getAllTournaments(): Promise<PartialRecord<LeagueName, League>> {
    const live = await this.getLiveTournaments();

    const apiCall = await fetch(
      `${API_BASE_URL}/v3/events/upcoming?sport_id=13&token=${this.token}`
    );
    const apiCallResult = (await apiCall.json()) as MatchesListApiResponse;

    const matches = apiCallResult.results
      .filter((result) => {
        return this.extractLeagueName(result.league.name) !== 'ITF';
      })
      .map(async (match): Promise<Match> => {
        return {
          id: match.id,
          player1: { name: match.home.name, img_url: ' ' },
          player2: { name: match.away.name, img_url: ' ' },
          league: match.league.name.split(' ')[0].toUpperCase() as LeagueName,
          tournament: match.league.name,
          time: convertFromEpoch(match.time),
          live: false,
          odds: await this.getMatchOdds(match.id),
          stats: null,
          extra: [],
          sets: null,
        };
      });

    for await (const match of matches) {
      live[match.league] = live[match.league] || {};
      live[match.league]![match.tournament] = live[match.league]![match.tournament] || [];
      live[match.league]![match.tournament].push(match);
    }

    const ordered = Object.keys(live)
      .sort(sortMatches)
      .reduce<PartialRecord<LeagueName, League>>((obj, key) => {
        obj[key as LeagueName] = live[key as LeagueName];
        return obj;
      }, {});

    return ordered;
  }

  async getMatchOdds(matchId: string): Promise<Odd> {
    try {
      const apiCall = await fetch(
        `${API_BASE_URL}/v2/event/odds?event_id=${matchId}&odds_market=1&token=${this.token}`
      );
      const apiCallResult = await apiCall.json();

      if (!apiCallResult.results.odds['13_1']) {
        return {
          odds1: '?',
          odds2: '?',
        } as Odd;
      }

      return {
        odds1: parseFloat(apiCallResult.results.odds['13_1'][0].home_od).toFixed(2),
        odds2: parseFloat(apiCallResult.results.odds['13_1'][0].away_od).toFixed(2),
      } as Odd;
    } catch (error) {
      console.log('coutas no capturadas');
      return {
        odds1: '?',
        odds2: '?',
      } as Odd;
    }
  }

  async getImgUrl(match: Match): Promise<Match> {
    try {
      const url = 'https://api.sofascore.com/api/v1/search/teams/' + match.player1.name;
      const apiCall = await fetch(url, { mode: 'cors' });
      const apiCallResult = await apiCall.json();

      const id = apiCallResult['teams'][0]['id'];
      const img_url = 'https://api.sofascore.com/api/v1/team/' + id.toLocaleString() + '/image';
      match.player1.img_url = img_url;
    } catch (error) {
      match.player1.img_url = ' ';
    }
    try {
      const url = 'https://api.sofascore.com/api/v1/search/teams/' + match.player2.name;
      const apiCall = await fetch(url, { mode: 'cors' });
      const apiCallResult = await apiCall.json();

      const id = apiCallResult['teams'][0]['id'];
      const img_url = 'https://api.sofascore.com/api/v1/team/' + id.toLocaleString() + '/image';
      match.player2.img_url = img_url;
    } catch (error) {
      match.player2.img_url = ' ';
    }
    return match;
  }

  private extractLeagueName(tournamentName: string): LeagueName {
    return tournamentName.split(' ')[0].toUpperCase() as LeagueName;
  }
}

function sortMatches(tournament1: string, tournament2: string): -1 | 0 | 1 {
  if (tournament1.localeCompare(tournament2) == 0) {
    // SON EL MISMO TORNEO
    return 0;
  }
  if (tournament1.startsWith('ATP')) {
    return -1;
  }
  if (tournament2.startsWith('ATP')) {
    return 1;
  }
  if (tournament1.startsWith('WTA') && !tournament2.startsWith('ATP')) {
    return -1;
  }
  if (tournament2.startsWith('WTA')) {
    // SABEMOS QUE T1 NO ES UN ATP
    return 1;
  }
  if (tournament1.startsWith('Challenger')) {
    return -1;
  }
  if (tournament2.startsWith('Challenger')) {
    return 1;
  }

  return 1;
}

function getScoreboard(match: MatchesListApiResponse['results'][0]): Scoreboard {
  const scoreboards = match.scores;
  let n_sets = Object.keys(scoreboards).length;

  const games1 = scoreboards[n_sets].home;
  const games2 = scoreboards[n_sets].away;
  let sets1 = 0;
  let sets2 = 0;

  if (n_sets > 1) {
    n_sets = n_sets - 1;

    while (n_sets > 0) {
      if (parseInt(scoreboards[n_sets].home) > parseInt(scoreboards[n_sets].away)) {
        sets1 += 1;
      } else {
        sets2 += 1;
      }
      n_sets -= 1;
    }
  }

  const sets = {} as Set;
  sets['sets1'] = sets1;
  sets['sets2'] = sets2;

  const games = {} as Game;
  games['games1'] = games1;
  games['games2'] = games2;

  return { sets: sets, games: games };
}

function convertFromEpoch(time: string): string {
  const myDate = new Date(parseInt(time) * 1000);

  let day = myDate.getDate().toLocaleString();
  let month = (myDate.getMonth() + 1).toLocaleString();
  let hour = myDate.getHours().toLocaleString();
  let minute = myDate.getMinutes().toLocaleString();

  if (day.length == 1) {
    day = '0' + day;
  }
  if (month.length == 1) {
    month = '0' + month;
  }
  if (hour.length == 1) {
    hour = '0' + hour;
  }
  if (minute.length == 1) {
    minute = '0' + minute;
  }
  // DATE IN FORMAT DD/MM HH:MM
  const date = day + '/' + month + ' ' + hour + ':' + minute;
  return date;
}
