import Accordion from 'react-bootstrap/Accordion'


export default function Hola(props) {
  const printMatch = (match) => {
      var player1 = match.player1.split(" ");
      var name_player1 = player1[0];
      player1.splice(0, 1);

      var player2 = match.player2.split(" ");
      var name_player2 = player2[0];
      player2.splice(0, 1);
      return (
      <div className="match-div">
          <span className="match-span">
              <a href="/login" className="match-href">
              <div className="players-div">
                  <div className="player1-div">
                      <img alt="wh-icon" className="wh-icon"
                      src="https://images.theabcdn.com/i/24738724/300x300/c"/>
                      <div className="odd1">
                          {match.odds1}
                      </div>
                      <img alt={match.player1} className="player1-img"
                      src={match.img_urls}/>
                      <div className="player1-text">
                          <div className="player-name">
                              {name_player1}
                          </div>
                          <div className="player-surname">
                              {player1.join(" ")}
                          </div>
                      </div>
                  </div>
                  <div className="sets-scoreboard">
                      Sets
                      {match.sets1} -
                      {match.sets2}
                  </div>
                  <div className="player2-div">
                      <div className="player2-text">
                          <div className="player-name">
                              {name_player2}
                          </div>
                          <div className="player-surname">
                              {player2.join(" ")}
                          </div>
                      </div>
                      <img alt={match.player2} className="player1-img"
                      src={match.img_urls}/>
                      <div className="odd2">
                          {match.odds2}
                      </div>
                      <img alt="wh-icon" className="wh-icon"
                      src="https://images.theabcdn.com/i/24738724/300x300/c"/>
                  </div>
              </div>
              </a>
          </span>
      </div>
    )
  }

  const printTournament = (tournament) => {
      console.log(tournament)
      return (
          <Accordion.Item eventKey={tournament[0]}>
            <Accordion.Header>
                {tournament[0]}
            </Accordion.Header>
            <Accordion.Body>
                {tournament[1].map((match) => {
                    return printMatch(match)
                })}
            </Accordion.Body>
          </Accordion.Item>
    )
  }

  const printCategory = (category, i) => {
      return (<Accordion.Item eventKey={i.toString()}>
                  <Accordion.Header>
                    {category[0]}
                  </Accordion.Header>
                  <Accordion.Body>
                    {JSON.stringify(category[1])}
                    {Object.entries(category[1]).map((tournament) => {
                        return printTournament(tournament)})}
                </Accordion.Body>
              </Accordion.Item>)
  }


  var tournaments = props.matches.tournaments
  var tournaments_list = Object.entries(tournaments)

  return (
    <html>
        <head>
            <title>My page title</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        </head>

        <body>
            <div className="title-bar">
                <div className="w3-bar">
                    <div className="w3-bar-item tennislive">TENNISLIVE</div>
                </div>
            </div>
            <div id="1">
                <Accordion defaultActiveKey='0'>
                    {tournaments_list.map((category, i) => {
                        return printCategory(category, i);
                    })}
                </Accordion>
            </div>
        </body>
    </html>

  )
}

export async function getStaticProps() {
    const TOKEN = '93709-kVsprdZ0CdjqrA';
    var URL = 'https://api.b365api.com/v1/events/inplay?sport_id=13&token=' + TOKEN;
    const matchesCall = await fetch(URL)
    const matchesResponse = await matchesCall.json()

    var matches = {}
    var list = {'ATP':[], 'WTA':[], 'Challenger':[], 'UTR':[]}
    matches.tournaments = list

    for (let result of matchesResponse.results) {
        if (result.league.name.startsWith('ITF')) {
            // POR AHORA NO NOS INTERESAN LOS ITF
            continue
        }
        var match = getLiveMatchesInfo(result)

        URL = 'https://api.b365api.com/v2/event/odds?token=' + TOKEN + '&event_id=' + match.id + '&odds_market=1';
        const matchOdds = await fetch(URL)
        const oddsResponse = await matchOdds.json()

        match = getMatchOdds(match, oddsResponse)
        var tournament = match.tournament
        var found = false
        for (let key in matches.tournaments) {
            if (key == tournament) {
                found = true
                break
            }
        }

        const main_t = tournament.split(" ")[0]
        if (found) {
            matches.tournaments[main_t][tournament].push(match)
        } else {
            matches.tournaments[main_t][tournament] = [match]
        }
    }


    //matches.tournaments = Object.keys(matches.tournaments).sort(sortMatches).reduce(
    //    (obj, key) => {
    //        obj[key] = matches.tournaments[key];
    //        return obj;
    //    },
    //    {}
    //)

    //console.log(matches)

    return {
        props: {
            matches,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 10 seconds
        revalidate: 10, // In seconds
    }
}

function getLiveMatchesInfo(result) {
    var match = {}

    var id = result.id
    match.id = id

    var player1 = result.home.name
    var player2 = result.away.name
    match.player1 = player1
    match.player2 = player2

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

function getMatchOdds(match, oddsResponse) {
    var lastOdds = oddsResponse.results.odds['13_1'][0]

    var odds1 = lastOdds.home_od
    var odds2 = lastOdds.away_od

    match.odds1 = odds1
    match.odds2 = odds2
    return match
}

function sortMatches(tournament1, tournament2) {
    const t1 = tournament1.split(" ");
    const t2 = tournament2.split(" ");

    if (t1[0].localeCompare(t2[0]) == 0) {
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
