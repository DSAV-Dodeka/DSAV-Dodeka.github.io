import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { SignupFlow } from "$functions/flows/signup.ts";
import { getRegistrationStatus, getToken } from "$functions/backend.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Fetch registration status using the token
  const {
    data: registrationStatus,
    isLoading: statusLoading,
    error: statusError,
  } = useQuery({
    queryKey: ["registration-status", token],
    queryFn: () => (token ? getRegistrationStatus(token) : null),
    enabled: !!token,
    refetchInterval: (query) => {
      // Poll every 10 seconds if not yet accepted
      if (query.state.data && !query.state.data.accepted) {
        return 10000;
      }
      return false;
    },
  });

  const signupFlow = useRef(new SignupFlow());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [complete, setComplete] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load verification code in dev mode
  const handleLoadCode = async () => {
    if (!registrationStatus?.email) return;

    setLoading(true);
    setStatus("");
    try {
      const result = await getToken(
        "signup_verification",
        registrationStatus.email,
      );
      if (result?.found) {
        setVerificationCode(result.code);
        setStatus("✓ Code loaded");
      } else {
        setStatus("✗ No code found (check if email was sent)");
      }
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    if (!registrationStatus?.signup_token) {
      setStatus("✗ No signup token available");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("✗ Passwords do not match");
      return;
    }

    if (password.length < 10) {
      setStatus("✗ Password must be at least 10 characters");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await signupFlow.current.tryComplete(
        registrationStatus.signup_token,
        verificationCode,
        password,
      );

      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setComplete(true);
      setStatus("✓ Account activated successfully!");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // No token in URL
  if (!token) {
    return (
      <div className="signup-container">
        <PageTitle title="Account activeren" />
        <div className="signup-card">
          <h1>Account activeren</h1>
          <div className="signup-error">
            <p>
              <strong>Geen registratietoken gevonden</strong>
            </p>
            <p>
              Je hebt een link nodig om je registratiestatus te bekijken. Heb je
              je net ingeschreven? Controleer dan je e-mail voor de
              bevestigingslink. Neem anders contact op met het bestuur via{" "}
              <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading registration status
  if (statusLoading) {
    return (
      <div className="signup-container">
        <PageTitle title="Account activeren" />
        <div className="signup-card">
          <h1>Even geduld...</h1>
          <p className="signup-intro">Je registratiestatus wordt opgehaald.</p>
        </div>
      </div>
    );
  }

  // Error fetching registration status
  if (statusError || !registrationStatus) {
    return (
      <div className="signup-container">
        <PageTitle title="Account activeren" />
        <div className="signup-card">
          <h1>Account activeren</h1>
          <div className="signup-error">
            <p>
              <strong>Ongeldige registratielink</strong>
            </p>
            <p>
              Deze registratielink is ongeldig of verlopen. Neem contact op met
              het bestuur via{" "}
              <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Signup complete
  if (complete) {
    return (
      <div className="signup-container">
        <PageTitle title="Account geactiveerd" />
        <div className="signup-card">
          <div className="signup-success-icon">✓</div>
          <h1>Account geactiveerd!</h1>
          <p>
            Je account is succesvol geactiveerd. Je bent nu ingelogd en kunt
            gebruik maken van alle ledenfunctionaliteiten.
          </p>
          <button
            onClick={() => navigate("/")}
            className="signup-btn signup-btn-primary"
          >
            Naar de homepagina
          </button>
        </div>
      </div>
    );
  }

  // Not yet accepted - show waiting message
  if (!registrationStatus.accepted) {
    return (
      <div className="signup-container">
        <PageTitle title="Aanmelding ontvangen" />
        <div className="signup-card">
          <div className="signup-pending-icon">⏳</div>
          <h1>Aanmelding ontvangen!</h1>

          <p className="signup-intro">
            Bedankt voor je aanmelding bij D.S.A.V. Dodeka. We hebben je
            gegevens ontvangen voor <strong>{registrationStatus.email}</strong>.
          </p>

          <div className="signup-steps">
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
                  Na goedkeuring ontvang je een e-mail met een verificatiecode
                  om je account te activeren.
                </p>
              </li>
              <li>
                <strong>Account activeren</strong>
                <p>
                  Met de link en code in de e-mail kun je een wachtwoord
                  instellen en je account activeren.
                </p>
              </li>
            </ol>
          </div>

          <div className="signup-note">
            <strong>Vragen?</strong> Neem contact op met het bestuur via{" "}
            <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>
          </div>
        </div>
      </div>
    );
  }

  // Accepted - show signup form
  return (
    <div className="signup-container">
      <PageTitle title="Account activeren" />
      <div className="signup-card">
        <h1>Account activeren</h1>
        <p className="signup-intro">
          Je aanmelding voor <strong>{registrationStatus.email}</strong> is
          goedgekeurd! Voer de verificatiecode uit je e-mail in en kies een
          wachtwoord om je account te activeren.
        </p>

        <form
          className="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCompleteSignup();
          }}
        >
          <div className="signup-field">
            <label htmlFor="verificationCode">Verificatiecode</label>
            <div className="signup-input-row">
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Code uit e-mail"
                required
                disabled={loading}
              />
              {import.meta.env.DEV && (
                <button
                  type="button"
                  className="signup-btn signup-btn-secondary"
                  onClick={handleLoadCode}
                  disabled={loading}
                >
                  Load
                </button>
              )}
            </div>
            <small>De 8-cijferige code uit de bevestigingsmail</small>
          </div>

          <div className="signup-field">
            <label htmlFor="password">Wachtwoord</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kies een wachtwoord"
              required
              disabled={loading}
              minLength={10}
            />
            <small>Minimaal 10 tekens</small>
          </div>

          <div className="signup-field">
            <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Herhaal je wachtwoord"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="signup-btn signup-btn-primary"
            disabled={loading}
          >
            {loading ? "Bezig met activeren..." : "Account activeren"}
          </button>
        </form>

        {status && (
          <div
            className={`signup-status ${status.startsWith("✓") ? "success" : "error"}`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
