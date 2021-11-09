import { Match } from '../utils/types';
import B365Api from './b365';
import { MatchType } from './types';

const API_BASE_URL = 'https://scra-320223.ew.r.appspot.com';

export default class BDApi {
  async getMtosByMatch(match_id: string, type: MatchType): Promise<Match> {
    const b365api = new B365Api('93709-kVsprdZ0CdjqrA');

    if (type == 'live') {
      const match = await b365api.getLiveMatchStats(match_id);
      return this.getMtos(match);
    } else {
      const match = await b365api.getUpComingMatchStats(match_id);
      return this.getMtos(match);
    }
  }

  async getMtos(match: Match): Promise<Match> {
    const player1 = match.player1.name;
    const player2 = match.player2.name;

    if (player1.indexOf('/') > -1 || player2.indexOf('/') > -1) {
      // ES UN PARTIDO DE DOBLES

      match['player1']['mtos'] = [];
      match['player2']['mtos'] = [];

      return match;
    }

    const apiCall = await fetch(`${API_BASE_URL}/mtos/${player1}`);
    const mtos_player1 = await apiCall.json();

    const apiCall2 = await fetch(`${API_BASE_URL}/mtos/${player2}`);
    const mtos_player2 = await apiCall2.json();

    match['player1']['mtos'] = mtos_player1;
    match['player2']['mtos'] = mtos_player2;

    return match;
  }
}
