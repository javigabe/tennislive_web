const API_BASE_URL = 'https://api.b365api.com'


export default class B365Api {
    constructor(token) {
        this.token = token
    }

    getEnabledTournaments() {
        return ['ATP', 'WTA', 'Challenger', 'UTR'];
    }

    async getTournaments() {
        const apiCall = await fetch(`${API_BASE_URL}/v1/events/inplay?sport_id=13&token=${this.token}`)
        const apiCallResult = await apiCall.json()

        const matches = apiCallResult.results
            .map((match) => {
                return {
                    id: match.id,
                    player1: match.home.name,
                    player2: match.away.name,
                    league: match.league.name.split(" ")[0].toUpperCase(),
                    tournament: match.league.name,
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
            league[match.league] = league[match.league] || []
            league[match.league].push(match)
        }

        return league;
    }

    async getMatchOdds(matchId) {
        const apiCall = await fetch(`${API_BASE_URL}/v2/event/odds?event_id=${matchId}&odds_market=1&token=${this.token}`)
        const apiCallResult = await apiCall.json()

        if (!apiCallResult.results.odds['13_1']) {
            return null;
        }

        return {
            odds1: apiCallResult.results.odds['13_1'][0].home_od,
            odds2: apiCallResult.results.odds['13_1'][0].away_od,
        }
    }
}


// DELETE ALL OF THIS
function getLiveMatchesInfo(result) {
    var scoreboards = result.scores
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

    match.sets1 = sets1
    match.sets2 = sets2

    match.games1 = games1
    match.games2 = games2

    var tournament = result.league.name
    match.tournament = tournament

    return match
}
