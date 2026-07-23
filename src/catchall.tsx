import { Link } from "react-router";
import { useSessionInfo } from "$functions/query.ts";
import Game from "./pages/leden/game/Game";
import "./catchall.css";

export default function Component() {
  const { data: session } = useSessionInfo();

  return (
    <>
      <div className="notfound-container">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Pagina niet gevonden</h2>
        <p className="notfound-message">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <Link to="/" className="notfound-link">
          Terug naar home
        </Link>
      </div>
      {session && <Game />}
    </>
  );
}
