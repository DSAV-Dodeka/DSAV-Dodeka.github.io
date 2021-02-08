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
import Trainingen from '../Trainingen/Trainingen';
import Wedstrijden from '../Wedstrijden/Wedstrijden';
import Agenda from '../Agenda/Agenda';
import WordLid from '../Word lid/WordLid';
import Contact from '../Contact/Contact';
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
        <Navbar.Brand id="brand" onClick={() => changeTab("home")} as={Link} to="/">DSAV`40</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav id="tabs" variant="pills" activeKey={currentTab}>
            <Nav.Link id="tab" eventKey="home" onClick={() => changeTab("home")} as={Link} to="/">Home</Nav.Link>
            <Nav.Link eventKey="nieuws" onClick={() => changeTab("nieuws")} as={Link} to="/nieuws">Nieuws</Nav.Link>
            <Nav.Link eventKey="over" onClick={() => changeTab("over")} as={Link} to="/over">Over</Nav.Link>
            <Nav.Link eventKey="trainingen" onClick={() => changeTab("trainingen")} as={Link} to="/trainingen">Trainingen</Nav.Link>
            <Nav.Link eventKey="wedstrijden"onClick={() => changeTab("wedstrijden")}  as={Link} to="/wedstrijden">Wedstrijden</Nav.Link>
            <Nav.Link eventKey="agenda" onClick={() => changeTab("agenda")} as={Link} to="/agenda">Agenda</Nav.Link>
            <Nav.Link eventKey="wordLid" onClick={() => changeTab("wordLid")} as={Link} to="/word_lid">Word lid!</Nav.Link>
            <Nav.Link eventKey="contact" onClick={() => changeTab("contact")} as={Link} to="/contact">Contact</Nav.Link>
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