const API_BASE_URL = 'https://api.b365api.com'


export default class B365Api {
    constructor(token) {
        this.token = token
    }

    getEnabledTournaments() {
        return ['ATP', 'WTA', 'CHALLENGER', 'UTR'];
    }

    async getLiveTournaments() {
        const apiCall = await fetch(`${API_BASE_URL}/v1/events/inplay?sport_id=13&token=${this.token}`)
        const apiCallResult = await apiCall.json()

        const matches = apiCallResult.results
            .map(async (match) => {
                return {
                    id: match.id,
                    player1: match.home.name,
                    player2: match.away.name,
                    league: match.league.name.split(" ")[0].toUpperCase(),
                    tournament: match.league.name,
                    time: convertFromEpoch(match.time),
                    live: true,
                    scoreboard: getScoreboard(match),
                }
            })
            .filter((match) => match.league !== 'ITF')

        
        const league = {}
        
        for await (const match of matches) {
            league[match.league] = league[match.league] || {}
            league[match.league][match.tournament] = league[match.league][match.tournament] || []
            league[match.league][match.tournament].push(match)
        }

        const ordered = Object.keys(league).sort(sortMatches).reduce(
            (obj, key) => { 
              obj[key] = league[key]; 
              return obj;
            }, 
            {}
          );
        return ordered;
    }


    async getUpcomingTournaments () {
        const apiCall = await fetch(`${API_BASE_URL}/v2/events/upcoming?sport_id=13&token=${this.token}`)
        const apiCallResult = await apiCall.json()

        const matches = apiCallResult.results
            .map(async (match) => {
                return {
                    id: match.id,
                    player1: {name: match.home.name, img_url: ' '},
                    player2: {name: match.away.name, img_url: ' '},
                    league: match.league.name.split(" ")[0].toUpperCase(),
                    tournament: match.league.name,
                    time: convertFromEpoch(match.time),
                    live: false,
                }
            })
            .filter((match) => match.league !== 'ITF')
            .map(async (match) => {
                return {
                    odds: await this.getMatchOdds(match.id),
                    ...match
                }
            });

        const league = {};

        for await (const match of matches) {
            league[match.league] = league[match.league] || {}
            league[match.league][match.tournament] = league[match.league][match.tournament] || []
            league[match.league][match.tournament].push(match)
        }

        const ordered = Object.keys(league).sort(sortMatches).reduce(
            (obj, key) => { 
              obj[key] = league[key]; 
              return obj;
            }, 
            {}
        );

        return ordered;
    }

    async getAllTournaments() {
        var live = await this.getLiveTournaments()

        const apiCall = await fetch(`${API_BASE_URL}/v2/events/upcoming?sport_id=13&token=${this.token}`)
        const apiCallResult = await apiCall.json()

        const matches = apiCallResult.results
            .map(async (match) => {
                return {
                    id: match.id,
                    player1: match.home.name,
                    player2: match.away.name,
                    league: match.league.name.split(" ")[0].toUpperCase(),
                    tournament: match.league.name,
                    time: convertFromEpoch(match.time),
                    live: false,
                }
            })
            .filter((match) => match.league !== 'ITF')
            .map(async (match) => {
                return {
                    odds: await this.getMatchOdds(match.id),
                    ...match
                }
            });
        
        for await (const match of matches) {
            live[match.league] = live[match.league] || {}
            live[match.league][match.tournament] = live[match.league][match.tournament] || []
            live[match.league][match.tournament].push(match)
        }

        const ordered = Object.keys(live).sort(sortMatches).reduce(
            (obj, key) => { 
              obj[key] = live[key]; 
              return obj;
            }, 
            {}
        );

        return ordered;
    }


    async getMatchOdds(matchId) {
        const apiCall = await fetch(`${API_BASE_URL}/v2/event/odds?event_id=${matchId}&odds_market=1&token=${this.token}`)
        const apiCallResult = await apiCall.json()

        if (!apiCallResult.results.odds['13_1']) {
            return null;
        }

        return {
            odds1: parseFloat(apiCallResult.results.odds['13_1'][0].home_od).toFixed(2),
            odds2: parseFloat(apiCallResult.results.odds['13_1'][0].away_od).toFixed(2),
        }
    }


    

    async getImgUrl(player) {
        try {
            const url = "https://api.sofascore.com/api/v1/search/teams/" + player;
            const apiCall = await fetch(url)
            const apiCallResult = await apiCall.json()

            var id = apiCallResult['teams'][0]['id']
            var img_url = "https://api.sofascore.com/api/v1/team/" + str(id) + "/image"
            return img_url
        } catch (error) {
            return ' '
        }
    }
}


function sortMatches(tournament1, tournament2) {
    const t1 = tournament1.split(" ");
    const t2 = tournament2.split(" ");

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
}

function getScoreboard(match) {
    var scoreboards = match.scores
    var n_sets = Object.keys(scoreboards).length

    var games1 = scoreboards[n_sets].home
    var games2 = scoreboards[n_sets].away
    var sets1 = 0
    var sets2 = 0

    if (n_sets > 1) {
        n_sets = n_sets - 1

        while (n_sets > 0) {
            if (parseInt(scoreboards[n_sets].home) > parseInt(scoreboards[n_sets].away)) {
                sets1 += 1
            }
            else {
                sets2 += 1
            }
            n_sets -= 1
        }
    }

    var sets = {}
    sets['sets1'] = sets1
    sets['sets2'] = sets2

    var games = {}
    games['games1'] = games1
    games['games2'] = games2

    return {sets: sets, games:games}
}

function convertFromEpoch(time) {
    var myDate = new Date(parseInt(time)*1000);
    // DATE IN FORMAT DD/MM HH:MM
    var date = myDate.getDate().toLocaleString() + '/' + (myDate.getMonth()+1).toLocaleString()
                + ' ' + myDate.getHours().toLocaleString() + ':' + myDate.getMinutes().toLocaleString()
    return (date)
}

