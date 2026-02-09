import { useNavigate, Link } from "react-router";
import { useSessionInfo } from "$functions/query.ts";
import PageTitle from "$components/PageTitle.tsx";
import verjaardagenImg from "$images/leden/verjaardagen.jpg";
import soonImg from "$images/leden/soon.jpg";
import "./leden.css";

export default function Leden() {
  const navigate = useNavigate();
  const { data: session, isLoading } = useSessionInfo();

  if (isLoading) {
    return (
      <div className="leden-container">
        <PageTitle title="Leden" />
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <PageTitle title="Leden" />
        <p className="leden-status">
          Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log
          in om deze pagina te kunnen bekijken.
        </p>
        <div className="leden-login">
          <button
            onClick={() => navigate("/account/login")}
            className="leden-login-button"
          >
            Inloggen
          </button>
        </div>
      </>
    );
  }

  const isMember = session.user.permissions.includes("member");

  if (!isMember) {
    return (
      <>
        <PageTitle title="Leden" />
        <p className="leden-status">
          Je hebt een actief lidmaatschap nodig om deze pagina te bekijken.
        </p>
      </>
    );
  }

  return (
    <>
      <PageTitle title={`Welkom, ${session.user.firstname}`} />
      <div className="leden-container">
        <div className="leden-routes">
          <Link className="leden-link leden-link-double" to="">
            <h1 className="leden-link-header leden-link-header-double">
              Inschrijven trainingen
            </h1>
            <img
              src={soonImg}
              className="leden-link-image leden-link-image-double"
              alt=""
            />
          </Link>
          <Link className="leden-link" to="verjaardagen">
            <h1 className="leden-link-header">Verjaardagen</h1>
            <img src={verjaardagenImg} className="leden-link-image" alt="" />
          </Link>
        </div>
      </div>
    </>
  );
}
