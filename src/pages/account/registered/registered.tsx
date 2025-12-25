import PageTitle from "$components/PageTitle.tsx";
import "./registered.css";

export default function Registered() {
  return (
    <div className="registered-container">
      <PageTitle title="Aanmelding ontvangen" />

      <div className="registered-card">
        <div className="registered-icon">✓</div>
        <h1>Aanmelding ontvangen!</h1>

        <p className="registered-intro">
          Bedankt voor je aanmelding bij D.S.A.V. Dodeka. We hebben je gegevens
          ontvangen.
        </p>

        <div className="registered-steps">
          <h2>Wat gebeurt er nu?</h2>
          <ol>
            <li>
              <strong>Beoordeling door het bestuur</strong>
              <p>
                Het bestuur bekijkt je aanmelding. Dit duurt meestal enkele
                werkdagen.
              </p>
            </li>
            <li>
              <strong>Bevestigingsmail</strong>
              <p>
                Na goedkeuring ontvang je een e-mail met een verificatiecode om
                je account te activeren.
              </p>
            </li>
            <li>
              <strong>Account activeren</strong>
              <p>
                Met de link en code in de e-mail kun je een wachtwoord instellen
                en je account activeren.
              </p>
            </li>
          </ol>
        </div>

        <div className="registered-note">
          <strong>Vragen?</strong> Neem contact op met het bestuur via{" "}
          <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>
        </div>
      </div>
    </div>
  );
}
