import React, { ReactElement, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table';
import Tabs from 'react-bootstrap/Tabs';

import B365Api from '../../../api/b365';
import BDApi from '../../../api/bdApi';
import { Match, MatchEvent, MatchSet, MatchStats, Mto } from '../../../utils/types';

type MatchProps = {
  match: Match;
};

export default function MatchPage(props: MatchProps) {
  console.log(props);

  useEffect(() => {
    //loadPhotos();
  }, []);

  const fillResume = (
    player1: string,
    player2: string,
    scoreboard: MatchSet | null,
    stats: MatchStats | null
  ): ReactElement => {
    return (
      <Tabs id="resumen-tabs" className="mt-2 mb-2">
        <Tab eventKey="scoreboard" title="Scoreboard">
          <Container>
            <Container className="match-sc-text">Scoreboard</Container>
            <Table className="scoreboard-table" borderless hover responsive size="sm">
              <thead>
                <tr>
                  <th></th>
                  <th>{player1}</th>
                  <th>{player2}</th>
                </tr>
              </thead>
              <tbody>
                {scoreboard !== null &&
                  Object.keys(scoreboard).map((setn): ReactElement => {
                    return (
                      <tr>
                        <td>Set {setn}</td>
                        <td>{scoreboard[setn]['home']}</td>
                        <td>{scoreboard[setn]['away']}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Container>
        </Tab>
        <Tab eventKey="Stats" title="Match stats">
          {fillStatsTable(stats)}
        </Tab>
      </Tabs>
    );
  };

  const fillStatsTable = (stats: MatchStats | null): ReactElement => {
    if (!stats || Object.keys(stats).length == 0) {
      return <div>No stats recorded</div>;
    }
    return (
      <Table className="stats-table" borderless responsive size="sm">
        <thead>
          <tr>
            <th>{player1}</th>
            <th>{player2}</th>
          </tr>
        </thead>
        <tbody>
          <Container className="stats-info-text">Aces</Container>
          <tr>
            <td>{stats['aces'][0]}</td>
            <td>{stats['aces'][1]}</td>
          </tr>
          <Container className="stats-info-text">Double faults</Container>
          <tr>
            <td>{stats['double_faults'][0]}</td>
            <td>{stats['double_faults'][1]}</td>
          </tr>
          <Container className="stats-info-text">First serve win %</Container>
          <tr>
            <td>{stats['win_1st_serve'][0]}</td>
            <td>{stats['win_1st_serve'][1]}</td>
          </tr>
          <Container className="stats-info-text">Break points</Container>
          <tr>
            <td>{stats['break_point_conversions'][0]}</td>
            <td>{stats['break_point_conversions'][1]}</td>
          </tr>
        </tbody>
      </Table>
    );
  };

  const fillMtosTable = (mtos: Mto[]): ReactElement => {
    if (mtos.length == 0) {
      return <div>No Mtos recorded</div>;
    }

    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Player</th>
            <th>Game</th>
            <th>MTO</th>
          </tr>
        </thead>
        <tbody>
          {mtos.map((mto) => {
            return (
              <tr>
                <td>{mto.date}</td>
                <td>{mto.player}</td>
                <td>{mto.game}</td>
                <td>{mto.text}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const fillMtos = (
    player1: string,
    player2: string,
    mtos1: Mto[] | null,
    mtos2: Mto[] | null
  ): ReactElement => {
    if (!mtos1 || !mtos2) {
      return <>No hay Mtos</>;
    }
    return (
      <Tabs id="mtos" className="mt-2 mb-2">
        <Tab eventKey="player1" title={player1}>
          {fillMtosTable(mtos1)}
        </Tab>
        <Tab eventKey="player2" title={player2}>
          {fillMtosTable(mtos2)}
        </Tab>
      </Tabs>
    );
  };

  const fillEvents = (events: MatchEvent[]): ReactElement => {
    if (events.length == 0) {
      return <div>No events recorded</div>;
    }

    const items = events.reverse().map((event): ReactElement => {
      return <ListGroup.Item>{event.text}</ListGroup.Item>;
    });

    return <>{items}</>;
  };

  const player1 = props.match.player1;
  const player2 = props.match.player2;

  return (
    <Container className="app">
      <Container className="match">
        <Container className="match-resume">
          <Container className="match-imgs mt-5">
            <img
              alt="wh-icon"
              className="player1-match-img"
              src="https://images.theabcdn.com/i/24738724/300x300/c"
            />
            <img
              alt="wh-icon"
              className="player2-match-img"
              src="https://images.theabcdn.com/i/24738724/300x300/c"
            />
          </Container>
          <Container className="players-info mt-2">
            <div className="player1-info mt-2">{player1.name}</div>
            <div className="scoreboard mt-2">
              {props.match.scoreboard?.sets.sets1}-{props.match.scoreboard?.sets.sets2}
            </div>
            <div className="player2-info mt-2">{player2.name}</div>
          </Container>
        </Container>
        <Container>
          <Tabs id="nav" className="mt-4 mb-3 nav-pills">
            <Tab eventKey="Resume" title="Resume">
              {fillResume(player1.name, player2.name, props.match.sets, props.match.stats)}
            </Tab>
            <Tab eventKey="Odds" title="Odds">
              "Odds"
            </Tab>
            <Tab eventKey="Mtos" title="Mtos">
              {fillMtos(player1.name, player2.name, player1.mtos, player2.mtos)}
            </Tab>
            <Tab eventKey="Events" title="Events">
              <ListGroup variant="flush" className="match-events">
                {fillEvents(props.match.events!)}
              </ListGroup>
            </Tab>
          </Tabs>
        </Container>
      </Container>
    </Container>
  );
}

export async function getStaticPaths() {
  const b365api = new B365Api('93709-kVsprdZ0CdjqrA');
  const ids = await b365api.getAllLiveMatchesId();

  const paths = ids.map((id) => {
    return {
      params: {
        id: id,
      },
    };
  });
  // [{params:{id:'1'}}]

  return { paths: paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  // params.id es el id del partido
  const bdApi = new BDApi();

  return {
    props: {
      match: await bdApi.getMtosByMatch(params.id, 'live'),
    },
  };
}
