import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import NavigationBar from './components/Navigation Bar/NavigationBar'
import Home from './pages/Home/Home';
import Nieuws from './pages/Nieuws/Nieuws';
import Over from './pages/Over/Over';
import Trainingen from './pages/Trainingen/Trainingen';
import Wedstrijden from './pages/Wedstrijden/Wedstrijden';
import Agenda from './pages/Agenda/Agenda';
import WordLid from './pages/Word lid/WordLid';
import Contact from './pages/Contact/Contact';
import ContactBar from "./components/Contact/ContactBar";
import Merchandise from "./pages/Merchandise/Merchandise";

function App() {
  return (
    <Router>
      <NavigationBar/>
      <div class="pt-24">
        <Switch>
          <Route path="/nieuws">
            <Nieuws />
          </Route>
          <Route path="/over/merchandise">
            <Merchandise />
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