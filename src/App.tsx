import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ReactGA from 'react-ga4';
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
import Wedstrijden from "./pages/Wedstrijden/Wedstrijden";
import Wedstrijd from "./pages/Eigen wedstrijden/Wedstrijd";
import "./App.scss";

ReactGA.initialize('G-Z0WSFFKY1X');

function App() {
  ReactGA.send({hitType: 'pageview', page: window.location.pathname});

  useEffect(() => {
    console.log(window.location.pathname);
    
  }, [])
  

  return (
        <Router>
          <div id="app_screen">
            <div id="app_container">
              <NavigationBar />
              <div id="app_flex">
                <Routes>
                  <Route path="/nieuws/spike" element={
                    <Spike />
                  }/>
                  <Route path="/nieuws" element={
                    <Nieuws />
                  }/>
                  <Route path="vereniging" element={<Vereniging />} />
                  <Route path="vereniging/commissies" element={<Commissies />} />
                  <Route path="vereniging/bestuur" element={<Bestuur />} />
                  <Route path="/trainingen" element={
                    <Trainingen />
                  }/>
                  <Route path="/wedstrijden/nskindoor" element={
                    <Wedstrijd />
                  }/>
                  <Route path="/wedstrijden" element={
                    <Wedstrijden />
                  }/>
                  <Route path="/word_lid" element={
                    <WordLid />
                  }/>
                  <Route path="/contact/sponsors" element={
                    <Sponsors />
                  }/>
                  <Route path="/contact" element={
                    <Contact />
                  }/>
                  <Route path="/"
                    element={<Home />}
                  />
                </Routes>
                <div id="app_flex_grow"/>
                <ContactBar />
              </div>
            </div>
          </div>
        </Router>
  );
}

export default App;