import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import {
  HashLink as Link
} from "react-router-hash-link";
import NavigationBar from './components/Navigation Bar/NavigationBar'
import Home from './pages/Home/Home';
import Nieuws from './pages/Nieuws/Nieuws';
import Spike from './pages/Spike/Spike';
import Vereniging from './pages/Vereniging/Vereniging';
import Trainingen from './pages/Trainingen/Trainingen';
import Wedstrijden from './pages/Wedstrijden/Wedstrijden';
import Agenda from './pages/Agenda/Agenda';
import WordLid from './pages/Word lid/WordLid';
import Contact from './pages/Contact/Contact';
import ContactBar from "./components/Contact Bar/ContactBar";
import Merchandise from "./pages/Merchandise/Merchandise";
import Commissies from "./pages/Commissies/Commissies";
import Bestuur from "./pages/Bestuur/Bestuur";
import Sponsors from "./pages/Sponsors/Sponsors";
import OWee from "./pages/OWee/OWee";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <div class="w-full bg-blauw bg-opacity-90">
        <div class="w-full max-w-screen-3xl bg-white border-r-0 3xl:border-r-8 3xl:border-l-8 border-white mx-auto">
          <div class="flex flex-col min-h-screen w-full max-w-screen-3xl mx-auto">
            <NavigationBar />
            <Switch>
              <Route path="/nieuws/spike">
                <Spike />
              </Route>
              <Route path="/nieuws">
                <Nieuws />
              </Route>
              {/* <Route path="/vereniging/merchandise">
            <Merchandise />
          </Route> */}
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
              <Route path="/owee">
                <OWee />
              </Route>
              {/* <Route path="/wedstrijden">
            <Wedstrijden />
          </Route> */}
              {/* <Route path="/agenda">
            <Agenda />
          </Route> */}
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
            <div class="flex-grow" />
            <ContactBar />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;