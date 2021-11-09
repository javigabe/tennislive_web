import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import B365Api from '../api/b365';
import firebase from '../firebase/clientApp';

export default function Home(props) {
  var allEntries = props.allTournaments;
  allEntries = Object.entries(allEntries);

  const [toUse, setToUse] = React.useState(allEntries);
  const [liveActive, setLiveActive] = React.useState(false);
  const [allActive, setAllActive] = React.useState(true);
  const [_document, setDocument] = React.useState(null);
  const router = useRouter();
  console.log('VALOR PHOTOS LOADED');

  const printMatches = (matches_list) => {
    return matches_list.map((match) => {
      var player1 = match.player1.name.split(' ');
      var name_player1 = player1[0];
      player1.splice(0, 1);

      var player2 = match.player2.name.split(' ');
      var name_player2 = player2[0];
      player2.splice(0, 1);

      if (isNaN(parseFloat(match.odds.odds1))) {
        // odds1 is not a float
        match.odds.odds1 = 'N/A';
      }
      if (isNaN(parseFloat(match.odds.odds2))) {
        // odds2 is not a float
        match.odds.odds2 = 'N/A';
      }

      if (match.live === true) {
        var sets1 = match.scoreboard.sets.sets1;
        var sets2 = match.scoreboard.sets.sets2;

        if (sets1 === undefined) {
          sets1 = '?';
        }
        if (sets2 === undefined) {
          sets2 = '?';
        }
      } else {
        var date = match.time.split(' ')[0];
        var time = match.time.split(' ')[1];
      }

      var match_url = '';
      if (match.live == true) {
        match_url = '/match/live/' + match.id.toString();
      } else {
        match_url = '/match/upcoming/' + match.id.toString();
      }

      return (
        <div className="match-div" style={{ cursor: 'pointer' }}>
          <Link href={match_url} passHref={true}>
            <span className="match-span">
              <div href="/match/live/1" className="players-div">
                <div className="player1-div">
                  <img
                    alt="wh-icon"
                    className="wh-icon"
                    src="https://images.theabcdn.com/i/24738724/300x300/c"
                  />
                  <div className="odds1">{match.odds.odds1}</div>
                  <img alt="player1-img" className="player1-img" src={match.player1.img_url} />
                  <div className="player1-text">
                    <div className="player-name">{name_player1}</div>
                    <div className="player-surname">{player1.join(' ')}</div>
                  </div>
                </div>
                {match.live == true && (
                  <div className="scoreboard">
                    <div className="sets-scoreboard">
                      <div className="sets-text">
                        Sets
                        <br />
                      </div>
                      {sets1} - {sets2}
                    </div>
                  </div>
                )}
                {match.live == false && (
                  <div>
                    {date}
                    <br />
                    {time}
                  </div>
                )}
                <div className="player2-div">
                  <div className="player2-text">
                    <div className="player-name">{name_player2}</div>
                    <div className="player-surname">{player2.join(' ')}</div>
                  </div>
                  <img alt="player2-img" className="player2-img" src={match.player2.img_url} />
                  <div className="odds2">{match.odds.odds2}</div>
                  <img
                    alt="wh-icon"
                    className="wh-icon"
                    src="https://images.theabcdn.com/i/24738724/300x300/c"
                  />
                </div>
              </div>
            </span>
          </Link>
        </div>
      );
    });
  };

  const printTournaments = (tournaments) => {
    var counter = -1;
    return (
      <Accordion defaultActiveKey="0">
        {Object.keys(tournaments).map((tournament) => {
          counter++;
          return (
            <Accordion.Item eventKey={counter.toString()}>
              <Accordion.Header>{tournament}</Accordion.Header>
              <Accordion.Body>{printMatches(tournaments[tournament])}</Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  };

  const changeToAll = () => {
    var matches = props.allTournaments;
    matches = Object.entries(matches);

    setAllActive(true);
    setLiveActive(false);

    setToUse(matches);
  };

  const changeToLive = () => {
    var matches = props.liveTournaments;
    matches = Object.entries(matches);

    setLiveActive(true);
    setAllActive(false);

    setToUse(matches);
  };

  const _loadPhotos = async () => {
    const b365api = new B365Api('');
    Object.entries(props.allTournaments).map((category) => {
      if (!props.enabledTournaments.includes(category[0])) {
        null;
      } else {
        var tournaments = category[1];
        var newList = [];
        Object.keys(tournaments).map((tournament) => {
          var matches_list = tournaments[tournament];
          matches_list.map(async (match) => {
            match = await b365api.getImgUrl(match);
            newList.push(match);
          });
          category[1][tournament] = newList;
        });
      }
    });
    console.log(props.allTournaments);
    setToUse(Object.entries(props.allTournaments));
  };

  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log('log out success');
        router.reload(window.location.pathname);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  const checkIfUserConnected = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var _uid = user.uid;
        //console.log(user.providerId);
        var loginButton = document.getElementById('loginButton');
        var registerButton = document.getElementById('registerButton');
        loginButton.textContent = user.email;
        loginButton.className = 'username';
        loginButton.id = 'username';

        var logOutButton = document.createElement('button');
        logOutButton.className = 'log-out-button';
        //logOutButton.innerHTML = "Log Out"
        logOutButton.onclick = () => logOut();
        var span = document.createElement('span');
        span.className = 'sign-out-text';
        span.textContent = 'Log Out';
        logOutButton.append(span);

        registerButton.parentNode.replaceChild(logOutButton, registerButton);
      } else {
        // User is signed out
        // ...
      }
    });
  };

  useEffect(() => {
    console.log('USE EFFECT');
    setDocument(document);
    checkIfUserConnected();
    //loadPhotos();
  }, []);

  var allClassName = (allActive ? 'active ' : '').concat('all-button');
  var liveClassName = (liveActive ? 'active ' : '').concat('live-button');

  return (
    <Container className="mt-5 pt-2 main">
      <Container className="mb-1 pb-2 selection">
        <Button onClick={() => changeToAll()} variant="outline-primary" className={allClassName}>
          All
        </Button>
        <Button onClick={() => changeToLive()} variant="outline-primary" className={liveClassName}>
          Live
        </Button>
      </Container>

      <Container className="matches-menu">
        <Tabs id="categories" className="mb-3 nav-pills">
          {toUse.map((tournament) => {
            if (!props.enabledTournaments.includes(tournament[0])) {
              return '';
            }
            return (
              <Tab eventKey={tournament[0]} title={tournament[0]}>
                {printTournaments(tournament[1])}
              </Tab>
            );
          })}
        </Tabs>
      </Container>
    </Container>
  );
}

export async function getStaticProps() {
  const b365api = new B365Api('93709-kVsprdZ0CdjqrA');

  return {
    props: {
      enabledTournaments: b365api.getEnabledTournaments(),
      liveTournaments: await b365api.getLiveTournaments(),
      allTournaments: await b365api.getAllTournaments(),
    },
  };
}
