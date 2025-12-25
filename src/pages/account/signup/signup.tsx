import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { SignupFlow } from "$functions/flows/signup.ts";
import { getToken } from "$functions/backend.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const signupFlow = useRef(new SignupFlow());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [complete, setComplete] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // For dev mode: load verification code from backend
  const handleLoadCode = async () => {
    if (!token) return;

    setLoading(true);
    setStatus("");
    try {
      // We need the email to get the token, but we don't have it here
      // The token store uses action:email as key, so we need to try a different approach
      // For now, we'll just show a message that this requires the email
      setStatus(
        "Use the flow-test page to load codes (requires email address)",
      );
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    if (!token) {
      setStatus("✗ No signup token found in URL");
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
        token,
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
              <strong>Geen activatietoken gevonden</strong>
            </p>
            <p>
              Je hebt een link nodig uit de bevestigingsmail om je account te
              activeren. Heb je nog geen mail ontvangen? Neem dan contact op met
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

  return (
    <div className="signup-container">
      <PageTitle title="Account activeren" />
      <div className="signup-card">
        <h1>Account activeren</h1>
        <p className="signup-intro">
          Voer de verificatiecode uit je e-mail in en kies een wachtwoord om je
          account te activeren.
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
