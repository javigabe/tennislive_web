import B365Api from '../api/b365'

import Accordion from 'react-bootstrap/Accordion'
import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'


export default function Home(props) {
    const printTournament = (tournaments) => {

        return (
            <Accordion>
                {Object.entries(tournaments).map((tournament) => {
                        return (
                            <Accordion.Item eventKey={tournament[0]}>
                            <Accordion.Header>{tournament[0]}</Accordion.Header>
                            <Accordion.Body>
                                {console.log(tournament[0])}
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                                est laborum.
                            </Accordion.Body>
                            </Accordion.Item>
                        )
                })}
            </Accordion>
        )
    }

    return (
        <Container className="pt-4">
            <h1>Matches</h1>
            <Tabs className="mb-3">
                {props.enabledTournaments.map((title) => {
                    if (props.tournaments[title] === undefined) {
                        console.log('No hay torneos de esta categoria')
                        return (
                            <Tab eventKey={title} title={title}>
                                No hay partidos
                            </Tab>
                        );
                    }
                    return (
                        <Tab eventKey={title} title={title}>
                            {printTournament(props.tournaments[title])}
                        </Tab>
                    )
                })}
            </Tabs>
        </Container>
    )
}

export async function getStaticProps() {
    const b365api = new B365Api('93709-kVsprdZ0CdjqrA');

    return {
        props: {
            enabledTournaments: b365api.getEnabledTournaments(),
            tournaments: await b365api.getTournaments(),
        },
    }
}
