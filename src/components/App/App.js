import React, {useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Home from '../Home/Home';
import Nieuws from '../Nieuws/Nieuws';
import Over from '../Over/Over';
import './custom.scss';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState(sessionStorage.getItem("tab"));

  function changeTab(newTab) {
    setCurrentTab(newTab);
    sessionStorage.setItem("tab", newTab);
  }

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand onClick={() => changeTab("home")} as={Link} to="/">DSAV`40</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav variant="pills" activeKey={currentTab}>
            <Nav.Link eventKey="home" onClick={() => changeTab("home")} as={Link} to="/">Home</Nav.Link>
            <Nav.Link eventKey="nieuws" onClick={() => changeTab("nieuws")} as={Link} to="/nieuws">Nieuws</Nav.Link>
            <Nav.Link eventKey="over" onClick={() => changeTab("over")}cas={Link} to="/over">Over</Nav.Link>
            <Nav.Link eventKey="trainingen" onClick={() => changeTab("over")} as={Link} to="/over">Trainingen</Nav.Link>
            <Nav.Link eventKey="wedstrijden"onClick={() => changeTab("over")}  as={Link} to="/over">Wedstrijden</Nav.Link>
            <Nav.Link eventKey="agenda" onClick={() => changeTab("over")} as={Link} to="/over">Agenda</Nav.Link>
            <Nav.Link eventKey="word_lid" onClick={() => changeTab("over")} as={Link} to="/over">Word lid!</Nav.Link>
            <Nav.Link eventKey="contact" onClick={() => changeTab("over")} as={Link} to="/over">Contact</Nav.Link>
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