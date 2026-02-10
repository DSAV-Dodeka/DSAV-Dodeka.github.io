import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { SignupFlow } from "$functions/flows/signup.ts";
import {
  getRegistrationStatus,
  getSessionInfo,
  getToken,
  lookupRegistration,
  renewSignup,
} from "$functions/backend.ts";
import type { RegistrationStatus } from "$functions/backend.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const codeFromUrl = searchParams.get("code");

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
      // Poll every 10 seconds until signup_token appears
      if (query.state.data && !query.state.data.signup_token) {
        return 10000;
      }
      return false;
    },
  });

  const signupFlow = useRef(new SignupFlow());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [complete, setComplete] = useState(false);
  const [memberGranted, setMemberGranted] = useState(false);

  // Auto-create signup for accepted users without signup_token (sync-imported)
  const [creatingSignup, setCreatingSignup] = useState(false);
  const signupCreated = useRef(false);

  // Auto-verification state
  const verificationAttempted = useRef(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [expired, setExpired] = useState(false);

  // Initialize verification code from URL if present
  const [verificationCode, setVerificationCode] = useState(codeFromUrl || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // For email+code lookup flow (when no token in URL)
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupCode, setLookupCode] = useState("");

  // Auto-create signup for accepted users without signup_token (sync-imported users)
  useEffect(() => {
    if (
      signupCreated.current ||
      !registrationStatus?.accepted ||
      registrationStatus.signup_token ||
      !token
    ) {
      return;
    }
    signupCreated.current = true;
    setCreatingSignup(true);

    renewSignup(token)
      .then((renewed) => {
        queryClient.setQueryData(
          ["registration-status", token],
          (old: RegistrationStatus | undefined) =>
            old ? { ...old, signup_token: renewed.signup_token } : old,
        );
        setCreatingSignup(false);
      })
      .catch(() => {
        setStatus(
          "Kon geen verificatie-e-mail versturen. Neem contact op met het bestuur.",
        );
        setCreatingSignup(false);
      });
  }, [registrationStatus, token, queryClient]);

  // Auto-verify email when we have signup_token + code from URL
  useEffect(() => {
    if (
      verificationAttempted.current ||
      !registrationStatus?.signup_token ||
      !codeFromUrl
    ) {
      return;
    }
    verificationAttempted.current = true;
    setVerifying(true);

    signupFlow.current
      .verifyEmail(registrationStatus.signup_token, codeFromUrl)
      .then(async (result) => {
        if (result.ok) {
          setEmailVerified(true);
          setVerifying(false);
          return;
        }

        if (result.error === "invalid_signup_token" && token) {
          // Signup expired — create a new one (sends new email automatically)
          try {
            const renewed = await renewSignup(token);
            // Update cached registration status with new signup_token
            queryClient.setQueryData(
              ["registration-status", token],
              (old: RegistrationStatus | undefined) =>
                old ? { ...old, signup_token: renewed.signup_token } : old,
            );
            setExpired(true);
            setVerificationCode(""); // Old code is no longer valid
          } catch {
            setStatus(
              "Kon geen nieuwe verificatie-e-mail versturen. Neem contact op met het bestuur.",
            );
          }
        } else {
          setStatus(result.error);
        }
        setVerifying(false);
      });
  }, [registrationStatus, codeFromUrl, token, queryClient]);

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
        setStatus("Code loaded");
      } else {
        setStatus("No code found (check if email was sent)");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    if (!registrationStatus?.signup_token) {
      setStatus("No signup token available");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Wachtwoorden komen niet overeen");
      return;
    }

    if (password.length < 10) {
      setStatus("Wachtwoord moet minimaal 10 tekens lang zijn");
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
        if (result.error === "invalid_signup_token" && token) {
          // Token expired during form submission — renew and tell user
          try {
            const renewed = await renewSignup(token);
            queryClient.setQueryData(
              ["registration-status", token],
              (old: RegistrationStatus | undefined) =>
                old ? { ...old, signup_token: renewed.signup_token } : old,
            );
            setExpired(true);
            setEmailVerified(false);
            setVerificationCode("");
            // Reset the flow instance since the signup token changed
            signupFlow.current = new SignupFlow();
          } catch {
            setStatus(
              "Kon geen nieuwe verificatie-e-mail versturen. Neem contact op met het bestuur.",
            );
          }
          return;
        }
        setStatus(result.error);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
      const session = await getSessionInfo();
      setMemberGranted(
        session?.user.permissions.includes("member") ?? false,
      );
      setComplete(true);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle email+code lookup to find registration token
  const handleLookup = async () => {
    if (!lookupEmail || !lookupCode) {
      setStatus("Vul zowel e-mail als code in");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await lookupRegistration(lookupEmail, lookupCode);
      if (result.found && result.token) {
        // Set code in state and redirect with token and code in URL
        setVerificationCode(lookupCode);
        setSearchParams({ token: result.token, code: lookupCode });
      } else {
        setStatus("Geen registratie gevonden met deze e-mail en code");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const voltaOk = searchParams.get("volta_ok") === "true";
  const registrationPending = searchParams.get("pending") === "true";

  // Volta registration succeeded, backend intentionally disabled or unreachable
  if (!token && (voltaOk || registrationPending)) {
    return (
      <div className="signup-container">
        <PageTitle title="Aanmelding ontvangen" />
        <div className="signup-card">
          <div className="signup-pending-icon">&#8987;</div>
          <h1>Aanmelding ontvangen!</h1>

          <p className="signup-intro">
            Je inschrijving bij de Atletiekunie is succesvol verwerkt.
          </p>

          {voltaOk && (
            <div className="signup-error">
              <p>
                <strong>Er is een probleem met de website</strong>
              </p>
              <p>
                Je account kon niet automatisch worden aangemaakt. Neem contact
                op met het bestuur zodat zij je account handmatig kunnen
                activeren.
              </p>
            </div>
          )}

          {registrationPending && (
            <p>
              Je ontvangt binnenkort een e-mail om je account te activeren. Dit
              kan enkele werkdagen duren.
            </p>
          )}

          <div className="signup-note">
            <strong>Vragen?</strong> Neem contact op met het bestuur via{" "}
            <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>{" "}
            of via onze sociale media.
          </div>
        </div>
      </div>
    );
  }

  // No token in URL - show email+code lookup form
  if (!token) {
    return (
      <div className="signup-container">
        <PageTitle title="Account activeren" />
        <div className="signup-card">
          <h1>Account activeren</h1>
          <p className="signup-intro">
            Voer je e-mailadres en de verificatiecode uit de e-mail in om je
            account te activeren.
          </p>

          <form
            className="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
          >
            <div className="signup-field">
              <label htmlFor="lookupEmail">E-mailadres</label>
              <input
                id="lookupEmail"
                type="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="je@email.nl"
                required
                disabled={loading}
              />
            </div>

            <div className="signup-field">
              <label htmlFor="lookupCode">Verificatiecode</label>
              <input
                id="lookupCode"
                type="text"
                value={lookupCode}
                onChange={(e) => setLookupCode(e.target.value)}
                placeholder="Code uit e-mail"
                required
                disabled={loading}
              />
              <small>De 8-cijferige code uit de bevestigingsmail</small>
            </div>

            <button
              type="submit"
              className="signup-btn signup-btn-primary"
              disabled={loading}
            >
              {loading ? "Zoeken..." : "Doorgaan"}
            </button>
          </form>

          {status && <div className="signup-status error">{status}</div>}

          <div className="signup-note">
            <strong>Geen code ontvangen?</strong> Neem contact op met het
            bestuur via{" "}
            <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>
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
        <PageTitle
          title={memberGranted ? "Account geactiveerd" : "Account aangemaakt"}
        />
        <div className="signup-card">
          <div className="signup-success-icon">&#10003;</div>
          <h1>{memberGranted ? "Account geactiveerd!" : "Account aangemaakt!"}</h1>
          {memberGranted ? (
            <p>
              Je account is succesvol geactiveerd. Je bent nu ingelogd en kunt
              gebruik maken van alle ledenfunctionaliteiten.
            </p>
          ) : (
            <div className="signup-approval-banner">
              <strong>Lidmaatschap in behandeling</strong>
              <p>
                Je account is aangemaakt en je bent nu ingelogd. Het bestuur
                moet je lidmaatschap nog goedkeuren. Dit duurt meestal enkele
                werkdagen. Je ontvangt hierover een e-mail.
              </p>
            </div>
          )}
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

  // Creating signup for sync-imported user (accepted but no signup yet)
  if (creatingSignup) {
    return (
      <div className="signup-container">
        <PageTitle title="Account activeren" />
        <div className="signup-card">
          <h1>Even geduld...</h1>
          <p className="signup-intro">
            We sturen je een verificatie-e-mail naar{" "}
            <strong>{registrationStatus.email}</strong>.
          </p>
        </div>
      </div>
    );
  }

  // No signup token yet - show waiting message
  if (!registrationStatus.signup_token) {
    return (
      <div className="signup-container">
        <PageTitle title="Aanmelding ontvangen" />
        <div className="signup-card">
          <div className="signup-pending-icon">&#8987;</div>
          <h1>Aanmelding ontvangen!</h1>

          <p className="signup-intro">
            Bedankt voor je aanmelding bij D.S.A.V. Dodeka. We hebben je
            gegevens ontvangen voor <strong>{registrationStatus.email}</strong>.
          </p>

          <p>
            Je ontvangt binnenkort een verificatie-e-mail om je account te
            activeren.
          </p>

          <div className="signup-note">
            <strong>Vragen?</strong> Neem contact op met het bestuur via{" "}
            <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>
          </div>
        </div>
      </div>
    );
  }

  // Auto-verifying email
  if (verifying) {
    return (
      <div className="signup-container">
        <PageTitle title="Account activeren" />
        <div className="signup-card">
          <h1>E-mail verifi&#235;ren...</h1>
          <p className="signup-intro">
            Je e-mailadres wordt geverifieerd. Even geduld.
          </p>
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

        {expired && (
          <div className="signup-status info">
            Je verificatielink was verlopen. Er is een nieuwe verificatie-e-mail
            verstuurd naar <strong>{registrationStatus.email}</strong>. Open de
            link in de nieuwe e-mail, of voer de nieuwe code hieronder in.
          </div>
        )}

        {!expired && emailVerified ? (
          <p className="signup-intro">
            Je e-mailadres <strong>{registrationStatus.email}</strong> is
            geverifieerd. Kies een wachtwoord om je account te activeren.
          </p>
        ) : (
          <p className="signup-intro">
            Voer de verificatiecode voor{" "}
            <strong>{registrationStatus.email}</strong> in en kies een
            wachtwoord om je account te activeren.
          </p>
        )}

        <form
          className="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleCompleteSignup();
          }}
        >
          {!emailVerified && (
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
          )}

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

        {status && <div className="signup-status error">{status}</div>}
      </div>
    </div>
  );
}
