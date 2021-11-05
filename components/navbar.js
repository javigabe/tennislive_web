import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'


export default function TennisNavBar() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand className="tennislive" href="/">Tennis Live</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav id="loginButton" className="login">
                    <Nav.Link href="/login">Log In</Nav.Link>
                </Nav>
                <Nav id="registerButton" className="register">
                    <Nav.Link href="/register">Register</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
