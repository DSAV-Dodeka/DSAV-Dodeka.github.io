import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"
import Home from '../Home/Home';
import Nieuws from '../Nieuws/Nieuws'
import Over from '../Over/Over'

function NavigationBar() {
  return (
    <Router>
        <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/nieuws">Nieuws</Link>
            </li>
            <li>
              <Link to="/over">Over</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          
          <Route path="/nieuws">
            <Nieuws />
          </Route>
          <Route path="/over">
            <Over />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
    
  );
}

export default NavigationBar;