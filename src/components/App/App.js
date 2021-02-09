import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Home from '../Home/Home';
import Nieuws from '../Nieuws/Nieuws';
import Over from '../Over/Over';
import Trainingen from '../Trainingen/Trainingen';
import Wedstrijden from '../Wedstrijden/Wedstrijden';
import Agenda from '../Agenda/Agenda';
import WordLid from '../Word lid/WordLid';
import Contact from '../Contact/Contact';
import './custom.scss';
import './App.css';

function Navig() {
  const location = useLocation();
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand id="brand"as={Link} to="/">DSAV`40</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav id="tabs" variant="pills" activeKey={location.pathname}>
            <Nav.Link eventKey="/" id="tab" as={Link} to="/">Home</Nav.Link>
            <Nav.Link eventKey="/nieuws" as={Link} to="/nieuws">Nieuws</Nav.Link>
            <Nav.Link eventKey="/over" as={Link} to="/over">Over</Nav.Link>
            <Nav.Link eventKey="/trainingen" as={Link} to="/trainingen">Trainingen</Nav.Link>
            <Nav.Link eventKey="/wedstrijden" as={Link} to="/wedstrijden">Wedstrijden</Nav.Link>
            <Nav.Link eventKey="/agenda" as={Link} to="/agenda">Agenda</Nav.Link>
            <Nav.Link eventKey="/word_lid" as={Link} to="/word_lid">Word lid!</Nav.Link>
            <Nav.Link eventKey="/contact" as={Link} to="/contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  )
}

function App() {
  return (
    <Router>
      <Navig />
      <div>
        <Switch>
          <Route path="/nieuws">
            <Nieuws />
          </Route>
          <Route path="/over">
            <Over />
          </Route>
          <Route path="/trainingen">
            <Trainingen />
          </Route>
          <Route path="/wedstrijden">
            <Wedstrijden />
          </Route>
          <Route path="/agenda">
            <Agenda />
          </Route>
          <Route path="/word_lid">
            <WordLid />
          </Route>
          <Route path="/contact">
            <Contact />
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