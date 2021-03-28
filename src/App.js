import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
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
import ContactBar from "./components/Contact Bar/ContactBar";
import Merchandise from "./pages/Merchandise/Merchandise";

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
      <ScrollToTop />
      <div class="flex flex-col min-h-screen">
        <NavigationBar />
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
        <div class="flex-grow"/>
        <ContactBar />
      </div>
    </Router>
  );
}

export default App;