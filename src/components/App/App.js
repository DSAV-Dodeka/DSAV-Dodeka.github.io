import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Home from '../Home/Home';
import Nieuws from '../Nieuws/Nieuws'
import Over from '../Over/Over'
import './custom.scss';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand as={Link} to="/">DSAV`40</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/nieuws">Nieuws</Nav.Link>
            <Nav.Link as={Link} to="/over">Over</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div>
        <Switch>
          <Route path="/nieuws">
            <Nieuws />
          </Route>
          <Route path="/over">
            <Over />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default App;