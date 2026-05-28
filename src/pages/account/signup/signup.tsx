import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { SignupFlow } from "$functions/flows/signup.ts";
import {
  getSessionInfo,
  getToken,
  lookupRegistration,
  renewSignup,
  RegistrationNotFoundError,
} from "$functions/backend.ts";
import type { RegistrationStatus } from "$functions/backend.ts";
import { useRegistrationStatus } from "$functions/query.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./signup.css";

// --- Phase types ---

type SignupPhase =
  | { type: "lookup" }
  | { type: "loading" }
  | { type: "not-found" }
  | { type: "error"; message: string }
  | { type: "not-accepted"; email: string }
  | { type: "creating-signup"; email: string; failed: boolean }
  | { type: "verifying"; email: string }
  | { type: "form"; email: string; emailVerified: boolean; expired: boolean }
  | { type: "complete" };

// --- Controller hook ---

function useSignupController() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const registrationId = searchParams.get("registration_id");
  const codeFromUrl = searchParams.get("code");

  const signupFlow = useRef(new SignupFlow());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [complete, setComplete] = useState(false);
  const [verificationCode, setVerificationCode] = useState(codeFromUrl ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupCode, setLookupCode] = useState("");

  // 1. Registration status
  const regQuery = useRegistrationStatus(registrationId);
  const reg = regQuery.data;

  // 2. Auto-renew: create fresh Faroe signup when accepted but no signup_token
  const needsRenewal =
    !!registrationId && !!reg && reg.accepted && !reg.signup_token;
  const autoRenew = useQuery({
    queryKey: ["auto-renew-signup", registrationId],
    queryFn: async () => {
      const result = await renewSignup(registrationId!);
      queryClient.setQueryData(
        ["registration-status", registrationId],
        (old: RegistrationStatus | undefined) =>
          old ? { ...old, signup_token: result.signup_token } : old,
      );
      return result;
    },
    enabled: needsRenewal,
    retry: false,
    staleTime: Infinity,
  });

  // 3. Auto-verify: fires once when signup_token + URL code both exist
  const autoVerifyKey = [
    "auto-verify-email",
    registrationId,
    codeFromUrl,
  ] as const;
  const autoVerify = useQuery<{ verified: boolean; expired: boolean }>({
    queryKey: autoVerifyKey,
    queryFn: async () => {
      const result = await signupFlow.current.verifyEmail(
        reg!.signup_token!,
        codeFromUrl!,
      );
      if (result.ok) return { verified: true, expired: false };
      if (result.error === "invalid_signup_token" && registrationId) {
        try {
          const renewed = await renewSignup(registrationId);
          queryClient.setQueryData(
            ["registration-status", registrationId],
            (old: RegistrationStatus | undefined) =>
              old ? { ...old, signup_token: renewed.signup_token } : old,
          );
          return { verified: false, expired: true };
        } catch {
          throw new Error(
            "Kon geen nieuwe verificatie-e-mail versturen. Neem contact op met het bestuur.",
          );
        }
      }
      throw new Error(result.error);
    },
    enabled: !!reg?.signup_token && !!codeFromUrl,
    retry: false,
    staleTime: Infinity,
  });

  const emailVerified = autoVerify.data?.verified ?? false;
  const expired = autoVerify.data?.expired ?? false;

  // --- Phase ---
  let phase: SignupPhase;
  if (complete) {
    phase = { type: "complete" };
  } else if (!registrationId) {
    phase = { type: "lookup" };
  } else if (regQuery.isLoading) {
    phase = { type: "loading" };
  } else if (regQuery.error) {
    if (regQuery.error instanceof RegistrationNotFoundError) {
      phase = { type: "not-found" };
    } else {
      phase = { type: "error", message: regQuery.error.message };
    }
  } else if (!reg) {
    phase = { type: "not-found" };
  } else if (!reg.accepted) {
    phase = { type: "not-accepted", email: reg.email };
  } else if (!reg.signup_token) {
    phase = {
      type: "creating-signup",
      email: reg.email,
      failed: !!autoRenew.error,
    };
  } else if (autoVerify.isFetching) {
    phase = { type: "verifying", email: reg.email };
  } else {
    phase = { type: "form", email: reg.email, emailVerified, expired };
  }

  const displayStatus =
    status || autoRenew.error?.message || autoVerify.error?.message || "";

  // --- Actions ---

  const handleLookup = async () => {
    if (!lookupEmail || !lookupCode) {
      setStatus("Vul zowel e-mail als code in");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const result = await lookupRegistration(lookupEmail, lookupCode);
      if (result.found && result.registration_id) {
        setVerificationCode(lookupCode);
        setSearchParams({
          registration_id: result.registration_id,
          code: lookupCode,
        });
      } else {
        setStatus("Geen registratie gevonden met deze e-mail en code");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    if (!reg?.signup_token) {
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
        reg.signup_token,
        verificationCode,
        password,
      );

      if (!result.ok) {
        if (result.error === "invalid_signup_token" && registrationId) {
          try {
            const renewed = await renewSignup(registrationId);
            queryClient.setQueryData(
              ["registration-status", registrationId],
              (old: RegistrationStatus | undefined) =>
                old ? { ...old, signup_token: renewed.signup_token } : old,
            );
            queryClient.setQueryData(autoVerifyKey, {
              verified: false,
              expired: true,
            });
            setVerificationCode("");
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
      await getSessionInfo();
      setComplete(true);
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCode = async () => {
    if (!reg?.email) return;
    setLoading(true);
    setStatus("");
    try {
      const result = await getToken("signup_verification", reg.email);
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

  return {
    phase,
    loading,
    status: displayStatus,
    navigate,
    lookupEmail,
    setLookupEmail,
    lookupCode,
    setLookupCode,
    handleLookup,
    verificationCode,
    setVerificationCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleCompleteSignup,
    handleLoadCode,
    retryRenewal: () => autoRenew.refetch(),
    retryStatus: () => regQuery.refetch(),
  };
}

// --- Component ---

export default function Signup() {
  const ctrl = useSignupController();

  switch (ctrl.phase.type) {
    case "lookup":
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
                ctrl.handleLookup();
              }}
            >
              <div className="signup-field">
                <label htmlFor="lookupEmail">E-mailadres</label>
                <input
                  id="lookupEmail"
                  type="email"
                  value={ctrl.lookupEmail}
                  onChange={(e) => ctrl.setLookupEmail(e.target.value)}
                  placeholder="je@email.nl"
                  required
                  disabled={ctrl.loading}
                />
              </div>
              <div className="signup-field">
                <label htmlFor="lookupCode">Verificatiecode</label>
                <input
                  id="lookupCode"
                  type="text"
                  value={ctrl.lookupCode}
                  onChange={(e) => ctrl.setLookupCode(e.target.value)}
                  placeholder="Code uit e-mail"
                  required
                  disabled={ctrl.loading}
                />
                <small>De 8-cijferige code uit de bevestigingsmail</small>
              </div>
              <button
                type="submit"
                className="signup-btn signup-btn-primary"
                disabled={ctrl.loading}
              >
                {ctrl.loading ? "Zoeken..." : "Doorgaan"}
              </button>
            </form>
            {ctrl.status && (
              <div className="signup-status error">{ctrl.status}</div>
            )}
            <div className="signup-note">
              <strong>Geen code ontvangen?</strong> Neem contact op met het
              bestuur via{" "}
              <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>
            </div>
          </div>
        </div>
      );

    case "loading":
      return (
        <div className="signup-container">
          <PageTitle title="Account activeren" />
          <div className="signup-card">
            <h1>Even geduld...</h1>
            <p className="signup-intro">
              Je registratiestatus wordt opgehaald.
            </p>
          </div>
        </div>
      );

    case "not-found":
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
                Deze registratielink is ongeldig of verlopen. Neem contact op
                met het bestuur via{" "}
                <a href="mailto:bestuur@dsavdodeka.nl">
                  bestuur@dsavdodeka.nl
                </a>
              </p>
            </div>
          </div>
        </div>
      );

    case "error":
      return (
        <div className="signup-container">
          <PageTitle title="Account activeren" />
          <div className="signup-card">
            <h1>Account activeren</h1>
            <div className="signup-error">
              <p>
                <strong>Er ging iets mis</strong>
              </p>
              <p>
                Er is een probleem met de verbinding. Probeer het later opnieuw
                of neem contact op met het bestuur.
              </p>
            </div>
            <button
              onClick={() => ctrl.retryStatus()}
              className="signup-btn signup-btn-primary"
            >
              Opnieuw proberen
            </button>
          </div>
        </div>
      );

    case "not-accepted":
      return (
        <div className="signup-container">
          <PageTitle title="Account activeren" />
          <div className="signup-card">
            <h1>Registratie in behandeling</h1>
            <p className="signup-intro">
              Je registratie voor <strong>{ctrl.phase.email}</strong> is
              ontvangen maar nog niet goedgekeurd door het bestuur. Je ontvangt
              een uitnodigingsmail zodra je bent geaccepteerd.
            </p>
            <div className="signup-note">
              Vragen? Neem contact op via{" "}
              <a href="mailto:bestuur@dsavdodeka.nl">bestuur@dsavdodeka.nl</a>
            </div>
          </div>
        </div>
      );

    case "creating-signup":
      return (
        <div className="signup-container">
          <PageTitle title="Account activeren" />
          <div className="signup-card">
            {ctrl.phase.failed ? (
              <>
                <h1>Verificatie-e-mail mislukt</h1>
                <div className="signup-error">
                  <p>
                    Het versturen van de verificatie-e-mail is mislukt. Probeer
                    het opnieuw of neem contact op met het bestuur.
                  </p>
                </div>
                {ctrl.status && (
                  <div className="signup-status error">{ctrl.status}</div>
                )}
                <button
                  onClick={() => ctrl.retryRenewal()}
                  className="signup-btn signup-btn-primary"
                >
                  Opnieuw proberen
                </button>
              </>
            ) : (
              <>
                <h1>Even geduld...</h1>
                <p className="signup-intro">
                  We sturen je een verificatie-e-mail naar{" "}
                  <strong>{ctrl.phase.email}</strong>.
                </p>
              </>
            )}
          </div>
        </div>
      );

    case "verifying":
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

    case "complete":
      return (
        <div className="signup-container">
          <PageTitle title="Account geactiveerd" />
          <div className="signup-card">
            <div className="signup-success-icon">&#10003;</div>
            <h1>Account geactiveerd!</h1>
            <p>
              Je account is succesvol geactiveerd. Je bent nu ingelogd en kunt
              gebruik maken van alle ledenfunctionaliteiten.
            </p>
            <button
              onClick={() => ctrl.navigate("/")}
              className="signup-btn signup-btn-primary"
            >
              Naar de homepagina
            </button>
          </div>
        </div>
      );

    case "form":
      return (
        <div className="signup-container">
          <PageTitle title="Account activeren" />
          <div className="signup-card">
            <h1>Account activeren</h1>

            {ctrl.phase.expired && (
              <div className="signup-status info">
                Je verificatielink was verlopen. Er is een nieuwe
                verificatie-e-mail verstuurd naar{" "}
                <strong>{ctrl.phase.email}</strong>. Open de link in de nieuwe
                e-mail, of voer de nieuwe code hieronder in.
              </div>
            )}

            {!ctrl.phase.expired && ctrl.phase.emailVerified ? (
              <p className="signup-intro">
                Je e-mailadres <strong>{ctrl.phase.email}</strong> is
                geverifieerd. Kies een wachtwoord om je account te activeren.
              </p>
            ) : (
              <p className="signup-intro">
                Voer de verificatiecode voor{" "}
                <strong>{ctrl.phase.email}</strong> in en kies een wachtwoord om
                je account te activeren.
              </p>
            )}

            <form
              className="signup-form"
              onSubmit={(e) => {
                e.preventDefault();
                ctrl.handleCompleteSignup();
              }}
            >
              {!ctrl.phase.emailVerified && (
                <div className="signup-field">
                  <label htmlFor="verificationCode">Verificatiecode</label>
                  <div className="signup-input-row">
                    <input
                      id="verificationCode"
                      type="text"
                      value={ctrl.verificationCode}
                      onChange={(e) => ctrl.setVerificationCode(e.target.value)}
                      placeholder="Code uit e-mail"
                      required
                      disabled={ctrl.loading}
                    />
                    {import.meta.env.DEV && (
                      <button
                        type="button"
                        className="signup-btn signup-btn-secondary"
                        onClick={ctrl.handleLoadCode}
                        disabled={ctrl.loading}
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
                  value={ctrl.password}
                  onChange={(e) => ctrl.setPassword(e.target.value)}
                  placeholder="Kies een wachtwoord"
                  required
                  disabled={ctrl.loading}
                  minLength={10}
                />
                <small>Minimaal 10 tekens</small>
              </div>

              <div className="signup-field">
                <label htmlFor="confirmPassword">Bevestig wachtwoord</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={ctrl.confirmPassword}
                  onChange={(e) => ctrl.setConfirmPassword(e.target.value)}
                  placeholder="Herhaal je wachtwoord"
                  required
                  disabled={ctrl.loading}
                />
              </div>

              <button
                type="submit"
                className="signup-btn signup-btn-primary"
                disabled={ctrl.loading}
              >
                {ctrl.loading ? "Bezig met activeren..." : "Account activeren"}
              </button>
            </form>

            {ctrl.status && (
              <div className="signup-status error">{ctrl.status}</div>
            )}
          </div>
        </div>
      );
  }
}
