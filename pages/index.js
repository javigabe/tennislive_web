import B365Api from '../api/b365'

import Accordion from 'react-bootstrap/Accordion'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import Link from 'next/link'


export default function Home(props) {
    const printMatches = (matches_list) => {
        return matches_list.map((match) => {
            console.log(match)
            var player1 = match.player1.split(" ");
            var name_player1 = player1[0];
            player1.splice(0, 1);

            var player2 = match.player2.split(" ");
            var name_player2 = player2[0];
            player2.splice(0, 1);

            if(isNaN(parseFloat(match.odds.odds1))) {
                // odds1 is not a float   
                match.odds.odds1 = "?" 
            }
            if(isNaN(parseFloat(match.odds.odds2))) {
                // odds2 is not a float   
                match.odds.odds2 = "?" 
            }

            var sets1 = match.scoreboard.sets.sets1;
            var sets2 = match.scoreboard.sets.sets2;
            if (sets1 === undefined) {
                sets1 = "?";
            }
            if (sets2 === undefined) {
                sets2 = "?";
            }
            return (
                <div className="match-div">
                    <span className="match-span">
                        <Link href="/" passHref={true}>
                        <div className="players-div">
                            <div className="player1-div">
                                <img alt="wh-icon" className="wh-icon"
                                src="https://images.theabcdn.com/i/24738724/300x300/c"/>
                                <div className="odds1">
                                    {match.odds.odds1}
                                </div>
                                <img alt="player1-img" className="player1-img"
                                    src={match.player1.img_url}/>
                                <div className="player1-text">
                                    <div className="player-name">
                                        {name_player1}
                                    </div>
                                    <div className="player-surname">
                                        {player1.join(" ")}
                                    </div>
                                </div>
                            </div>
                            {match.live == true &&
                                <div className="scoreboard"> 
                                    <div className="sets-scoreboard">
                                        <div className="sets-text">
                                            Sets<br/>
                                        </div>
                                        {sets1} - {sets2}
                                    </div>
                                </div>
                            }
                            <div className="player2-div">
                                <div className="player2-text">
                                    <div className="player-name">
                                        {name_player2}
                                    </div>
                                    <div className="player-surname">
                                        {player2.join(" ")}
                                    </div>
                                </div>
                                <img alt="player2-img" className="player2-img"
                                src={match.player2.img_url}/>
                                <div className="odds2">
                                    {match.odds.odds2}
                                </div>
                                <img alt="wh-icon" className="wh-icon"
                                src="https://images.theabcdn.com/i/24738724/300x300/c"/>
                            </div>
                        </div>
                        </Link>
                    </span>
                </div>
            );
        })
       
    }

    const printTournaments = (tournaments) => {
        var counter = -1;
        return (
            <Accordion defaultActiveKey="0">
                {Object.keys(tournaments).map((tournament) => {
                    counter++;
                    return (
                        <Accordion.Item eventKey={counter.toString()}>
                            <Accordion.Header>{tournament}</Accordion.Header>
                            <Accordion.Body>
                                {printMatches(tournaments[tournament])}
                            </Accordion.Body>
                        </Accordion.Item>
                    )      
                })}
            </Accordion>
        )
    }

    var entries = props.tournaments
    entries = Object.entries(entries)


    return (
        <Container className="main">
            <Container className="mt-5 pt-2 matches-menu">
                <Tabs id="categories" className="mb-3 nav-pills">
                    {entries.map((tournament) => {
                        if (!props.enabledTournaments.includes(tournament[0])) {
                            return ''
                        }
                        return (
                            <Tab eventKey={tournament[0]} title={tournament[0]}>
                                {printTournaments(tournament[1])}
                            </Tab>
                        )
                    })}
                </Tabs>
            </Container>
        </Container> 
        
    )
}

export async function getStaticProps() {
    const b365api = new B365Api('93709-kVsprdZ0CdjqrA');

    return {
        props: {
            enabledTournaments: b365api.getEnabledTournaments(),
            tournaments: await b365api.getLiveTournaments(),
        },
    }
}

async function getAllTournaments() {
    const b365api = new B365Api('93709-kVsprdZ0CdjqrA');


}
