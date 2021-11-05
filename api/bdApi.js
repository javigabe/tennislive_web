import B365Api from "./b365"

const API_BASE_URL = 'https://scra-320223.ew.r.appspot.com'

export default class BDApi {
    constructor() {
    }

    async getMtosByMatch(match_id) {
        const b365api = new B365Api('93709-kVsprdZ0CdjqrA');
        var match = await b365api.getLiveMatchStats(match_id);

        var player1 = match.player1.name;
        var player2 = match.player2.name;

        if (player1.indexOf("/") > -1 || player2.indexOf("/") > -1) {
            // ES UN PARTIDO DE DOBLES
            var response = {
                match: match,
            }
            
            response[player1] = [];
            response[player2] = [];
           
            return response;
        }

        const apiCall = await fetch(`${API_BASE_URL}/mtos/${player1}`)
        const mtos_player1 = await apiCall.json()

        const apiCall2 = await fetch(`${API_BASE_URL}/mtos/${player2}`)
        const mtos_player2 = await apiCall2.json()

        var response = {
            match: match,
        }
        
        response[player1] = mtos_player1;
        response[player2] = mtos_player2;
       
        return response;
    }
}