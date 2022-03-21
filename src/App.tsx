import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
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
import Wedstrijden from "./pages/Wedstrijden/Wedstrijden";
import Wedstrijd from "./pages/Eigen wedstrijden/Wedstrijd";
import "./App.scss";

import AuthRedirect from "./pages/Auth/AuthRedirect";
import AuthCallback from "./pages/Auth/AuthCallback";
import {AuthProvider, AuthState, useAuth} from "./pages/Auth/AuthContext";
import Protected from "./pages/Auth/Protected";
import Login from "./components/Login/Login";

function App() {
  const [authState, setAuthState] = useState(new AuthState());
  const contextValue = { authState, setAuthState }
  const [authLoad, setAuthLoad] = useState(false)

  useEffect(() => {
    if (!authLoad) {
      const authLoader = async () => {
        let loadedState = await useAuth()
        setAuthState(loadedState)
      }

      authLoader().then(() => setAuthLoad(true))
    }
  }, [])

  return (
      <AuthProvider value={contextValue}>
        <Router>
          <div id="app_screen">
            <div id="app_container">
              <Login />
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
                  <Route path="/lg" element={<AuthRedirect />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/profile" element={<Protected />} />
                </Routes>
                <div id="app_flex_grow"/>
                <ContactBar />
              </div>
            </div>
          </div>
        </Router>
      </AuthProvider>
  );
}

export default App;