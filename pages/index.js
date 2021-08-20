import B365Api from '../api/b365'

import Container from 'react-bootstrap/Container'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'


export default function Home(props) {
    return (
        <Container className="pt-4">
            <h1>Matches</h1>
            <Tabs className="mb-3">
                {props.enabledTournaments.map((title) => {
                    return (
                        <Tab eventKey={title} title={title}>
                        {JSON.stringify(props.tournaments[title])}
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
