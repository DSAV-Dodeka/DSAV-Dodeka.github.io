import logo from "../../images/.ComCom.jpg";
import './Home.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Coming soon...
        </p>
        <a
          className="App-link"
          href="https://www.av40.nl"
          target="_blank"
          rel="noopener noreferrer"
        >
          AV`40 website
        </a>
      </header>
    </div>
  );
}

export default Home;
