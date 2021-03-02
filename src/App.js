import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import NavigationBar from './components/Shared/Navigation Bar/NavigationBar'
import Home from './components/Home/Home';
import Nieuws from './components/Nieuws/Nieuws';
import Over from './components/Over/Over';
import Trainingen from './components/Trainingen/Trainingen';
import Wedstrijden from './components/Wedstrijden/Wedstrijden';
import Agenda from './components/Agenda/Agenda';
import WordLid from './components/Word lid/WordLid';
import Contact from './components/Contact/Contact';
import ContactBar from "./components/Shared/Contact/ContactBar"

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