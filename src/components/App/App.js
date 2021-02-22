import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import NavigationBar from './Navigation Bar/NavigationBar'
import Home from '../Home/Home';
import Nieuws from '../Nieuws/Nieuws';
import Over from '../Over/Over';
import Trainingen from '../Trainingen/Trainingen';
import Wedstrijden from '../Wedstrijden/Wedstrijden';
import Agenda from '../Agenda/Agenda';
import WordLid from '../Word lid/WordLid';
import Contact from '../Contact/Contact';
import ContactBar from "../Shared/Contact/ContactBar"

function App() {
  return (
    <Router>
      <NavigationBar/>
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
      <ContactBar/>
    </Router>
  );
}

export default App;