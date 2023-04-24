import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import NavigationBar from './components/Navigation Bar/NavigationBar'
import Home from './pages/Home/Home';
import Nieuws from './pages/Nieuws/Nieuws/Nieuws';
import Spike from './pages/Nieuws/Spike/Spike';
import Vereniging from './pages/Vereniging/Vereniging/Vereniging';
import Trainingen from './pages/Trainingen/Trainingen';
import WordLid from './pages/Word lid/WordLid';
import Contact from './pages/Contact/Contact/Contact';
import ContactBar from "./components/Contact Bar/ContactBar";
import Commissies from "./pages/Vereniging/Commissies/Commissies";
import Bestuur from "./pages/Vereniging/Bestuur/Bestuur";
import Sponsors from "./pages/Contact/Sponsors/Sponsors";
import Wedstrijden from "./pages/Wedstrijden/Wedstrijden/Wedstrijden";
import WedstrijdText from "./content/Wedstrijden.json";
import ActiviteitenText from "./content/Activiteiten.json"
import Wedstrijd from "./pages/Wedstrijden/Eigen wedstrijden/Wedstrijd";
import Arnold from "./pages/Vereniging/Arnold/Arnold";
import Records from "./pages/Wedstrijden/Records/Records";
import Verjaardagen from "./pages/Leden/Verjaardagen/Verjaardagen";
import Leden from "./pages/Leden/Leden";
import Gezelligheid from "./pages/Vereniging/Gezelligheid/Gezelligheid";
import Klassementen from "./pages/Leden/Klassementen/Klassementen";
import Hoogtepunten from "./pages/Wedstrijden/Hoogtepunten/Hoogtepunten";
import "./App.scss";

import AuthRedirect from "./pages/Auth/AuthRedirect";
import AuthCallback from "./pages/Auth/AuthCallback";
import {
  AuthProvider,
  AuthState,
  newAuthState,
  renewAuth, saveStorage,
  useAuth,
  useLogout
} from "./pages/Auth/AuthContext";
import Profiel from "./pages/Profiel/Profiel";
import Admin from "./pages/Admin/Admin";
import Registered from "./pages/Auth/Registered";
import ProfielDebug from "./pages/Profiel/ProfielDebug";
import {Logger} from "./functions/logger";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {err_api} from "./functions/api";
import {number} from "zod";
import ChangeEmail from "./pages/Account/Email/ChangeEmail";
import DeleteAccount from "./pages/Account/Delete/DeleteAccount";
import Activiteiten from "./pages/Activiteiten/Activiteiten";
import Activiteit from "./pages/Activiteiten/components/Activiteit";
import ActiviteitPagina from "./pages/Activiteiten/ActiviteitPagina";

const cacheTime = 1000 * 60 // 1 minute

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime,
    },
  },
})

function App() {
  const [authState, setAuthState] = useState(newAuthState());
  const contextValue = { authState, setAuthState }

  const authLoader = (signal: AbortSignal, which: string) => {
    Logger.debug(`Loading auth ${which}...`)
    return useAuth(signal).then((loadedState) => {
      if (!signal.aborted) {
        Logger.debug(`Setting loaded signal ${signal.aborted} AuthState ${which}...`)
        Logger.debug({[`LoadedState ${which}`]: loadedState})
        setAuthState(loadedState)
        saveStorage(loadedState)
        return loadedState
      }
    })
  }

  // This is called when localStorage is called in another document (i.e. ANOTHER tab, not current one)
  // As a resul
  const onStorageUpdate = (e: StorageEvent) => {
    const { key, newValue } = e;
    if (key === "refresh") {
      const compareNew = newValue === null ? "" : newValue

      if (authState.refresh !== compareNew) {
        Logger.debug(`localStorage refresh token changed in another document! new ${compareNew} old ${authState.refresh}`)

        if (compareNew === "" || compareNew === null) {
          Logger.debug(`Logging out after localStorage update!`)
          const as = useLogout(authState)
          setAuthState(as)
        } else {
          renewAuth(compareNew).then((as) => {
            Logger.debug(`Logging in with new details after localStorage update!`)
            as.isLoaded = true
            setAuthState(as)
          }).catch(async (e) => {
            const err = await err_api(e)
            Logger.warn({ "renewAuth after localStorage update error": err.j() })
          })
        }
      }
    }
  }

  useEffect(() => {
    const ac = new AbortController()
    const which = Math.random().toString().substring(0, 5)

    Logger.debug(`App update after load ${which} or AuthState Change. Loaded: ${authState.isLoaded}. Authenticated: ${authState.isAuthenticated ? authState.it.sub : "false"}`)

    if (!authState.isLoaded) {
      authLoader(ac.signal, which).then((loadedAs) => {
        if (loadedAs !== undefined) {
          Logger.debug(`App AuthState ${which} loaded...`)
        }
      })
    } else {
      window.addEventListener("storage", onStorageUpdate)
    }

    return () => {
      Logger.debug(`Aborting ${which}`)
      ac.abort()
      window.removeEventListener("storage", onStorageUpdate)
    }
  }, [authState])

  return (
      <AuthProvider value={contextValue}>
        <QueryClientProvider client={queryClient} >
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
                    <Route path="/vereniging" element={<Vereniging />} />
                    <Route path="/vereniging/commissies" element={<Commissies />} />
                    <Route path="/vereniging/bestuur" element={<Bestuur />} />
                    <Route path="/vereniging/arnold" element={<Arnold />} />
                    <Route path="/vereniging/gezelligheid" element={<Gezelligheid />} />
                    {/*<Route path="/vereniging/activiteiten" element={*/}
                    {/*  <Activiteiten />*/}
                    {/*}/>*/}
                    <Route path="/trainingen" element={
                      <Trainingen />
                    }/>
                    {WedstrijdText.wedstrijden.map((item) =>
                        (item.path === "" ? "" :
                                <Route path={"/wedstrijden" + item.path} key={"wdstr" + item.naam + item.datum} element={
                                  <Wedstrijd wedstrijd={item}/>
                              }/>
                        )
                    )}
                    {/* Op dit moment zijn er geen activiteitenpagina's*/}
                    {/*{ActiviteitenText.wedstrijden.map((item) =>*/}
                    {/*    (item.path === "" ? "" :*/}
                    {/*            <Route path={"/vereniging/activiteiten" + item.path} key={"actv" + item.naam + item.datum} element={*/}
                    {/*              <ActiviteitPagina wedstrijd={item} typePath={"vereniging/activiteiten"}/>*/}
                    {/*            }/>*/}
                    {/*    )*/}
                    {/*)}*/}
                    <Route path="/wedstrijden/hoogtepunten" element={
                      <Hoogtepunten />
                    }/>
                    <Route path="/wedstrijden" element={
                      <Wedstrijden />
                    }/>
                    <Route path="/wedstrijden/records" element={
                      <Records />
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
                      <Route path="/leden/verjaardagen" element={
                        <Verjaardagen />
                      }/>
                      <Route path="/leden/klassementen" element={
                        <Klassementen />
                      }/>
                      <Route path="/leden" element={
                        <Leden />
                      }/>
                      <Route path="/"
                        element={<Home />}
                      />
                      <Route path="/account/email" element={<ChangeEmail />} />
                      <Route path="/account/delete" element={<DeleteAccount />} />
                      <Route path="/lg" element={<AuthRedirect />} />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      <Route path="/profiel" element={<Profiel />} />
                      <Route path="/profiel/debug" element={<ProfielDebug />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/registered" element={<Registered />}/>

                  </Routes>
                  <div id="app_flex_grow"/>
                  <ContactBar />
                </div>
              </div>
            </div>
          </Router>
        </QueryClientProvider>
      </AuthProvider>
  );
}

export default App;