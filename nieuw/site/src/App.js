import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import NavigationBar from './components/Navigation Bar/NavigationBar'
import Home from './pages/Home/Home';
import Nieuws from './pages/Nieuws/Nieuws';
import Spike from './pages/Spike/Spike';
import Vereniging from './pages/Vereniging/Vereniging';
import Trainingen from './pages/Trainingen/Trainingen';
import WordLid from './pages/Word lid/WordLid';
import Contact from './pages/Contact/Contact';
import ContactBar from "./components/Contact Bar/ContactBar";
import Commissies from "./pages/Commissies/Commissies";
import Bestuur from "./pages/Bestuur/Bestuur";
import Sponsors from "./pages/Sponsors/Sponsors";
import "./App.scss";

function App() {
  return (
    <Router>
      <div id="app_screen">
        <div id="app_container">
          <div id="app_flex" class="flex flex-col min-h-screen w-full max-w-screen-3xl mx-auto">
            <NavigationBar />
            <Switch>
              <Route path="/nieuws/spike">
                <Spike />
              </Route>
              <Route path="/nieuws">
                <Nieuws />
              </Route>
              <Route path="/vereniging/commissies">
                <Commissies />
              </Route>
              <Route path="/vereniging/bestuur">
                <Bestuur />
              </Route>
              <Route path="/vereniging">
                <Vereniging />
              </Route>
              <Route path="/trainingen">
                <Trainingen />
              </Route>
              <Route path="/word_lid">
                <WordLid />
              </Route>
              <Route path="/contact/sponsors">
                <Sponsors />
              </Route>
              <Route path="/contact">
                <Contact />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
            <div id="app_flex_grow"/>
            <ContactBar />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;