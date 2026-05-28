import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as api from "$functions/backend.ts";
import type { AdminRegistrationRecord } from "$functions/backend.ts";
import { SignupFlow } from "$functions/flows/signup.ts";
import PendingRegistrations from "$components/PendingRegistrations.tsx";
import { TEST_EMAIL, TEST_FIRSTNAME, TEST_LASTNAME, TEST_PASSWORD } from "./constants";

export default function RegisterFlow() {
  const queryClient = useQueryClient();
  const signupFlow = useRef(new SignupFlow());
  const [step, setStep] = useState<
    "register" | "accept" | "signup" | "complete"
  >("register");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState(TEST_EMAIL);
  const [firstname, setFirstname] = useState(TEST_FIRSTNAME);
  const [lastname, setLastname] = useState(TEST_LASTNAME);
  const [registrationId, setRegistrationId] = useState("");
  const [signupToken, setSignupToken] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState(TEST_PASSWORD);

  // Pending registrations state
  const [pendingRegs, setPendingRegs] = useState<AdminRegistrationRecord[]>([]);
  const [pendingLoaded, setPendingLoaded] = useState(false);

  const handleRequestRegistration = async () => {
    setLoading(true);
    setStatus("");
    try {
      await api.requestRegistration(email, firstname, lastname);
      setStatus("Registration requested (pending admin acceptance)");
      setStep("accept");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPending = async () => {
    setLoading(true);
    setStatus("");
    try {
      const regs = await api.listRegistrations();
      setPendingRegs(regs);
      setPendingLoaded(true);
      setStatus(`Loaded ${regs.length} registrations`);
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async (reg: AdminRegistrationRecord) => {
    setLoading(true);
    setStatus("");
    try {
      setEmail(reg.email);
      setRegistrationId(reg.registration_id);

      if (!reg.accepted) {
        setStatus(`Resumed for ${reg.email} (needs acceptance)`);
        setStep("accept");
      } else {
        setStatus(`Resumed for ${reg.email} (accepted, needs signup)`);
        setStep("signup");
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    setStatus("");
    try {
      // Find registration by email if we don't have the ID yet
      let regId = registrationId;
      if (!regId) {
        const regs = await api.listRegistrations();
        const reg = regs.find((r) => r.email === email);
        if (!reg) {
          setStatus("Error: No registration found for this email");
          return;
        }
        regId = reg.registration_id;
        setRegistrationId(regId);
      }
      await api.acceptRegistration(regId);
      setStatus("Registration accepted, invite email sent");
      setStep("signup");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewSignup = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await api.renewSignup(registrationId);
      setSignupToken(result.signup_token);
      setVerificationCode("");
      signupFlow.current = new SignupFlow();
      setStatus("Signup renewed, new verification email sent");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCode = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await api.getToken("signup_verification", email);
      if (result?.found) {
        setVerificationCode(result.code);
        setStatus("Code loaded");
      } else {
        setStatus("No code found (check if email was sent)");
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await signupFlow.current.tryComplete(
        signupToken,
        verificationCode,
        password,
      );
      if (!result.ok) {
        if (result.error.includes("invalid_signup_token")) {
          setStatus(
            "Signup token expired. Click 'Renew Signup' to get a new one.",
          );
          return;
        }
        setStatus(`Error: ${result.error}`);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("Signup complete");
      setStep("complete");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("register");
    setStatus("");
    setRegistrationId("");
    setSignupToken("");
    setVerificationCode("");
    signupFlow.current = new SignupFlow();
  };

  return (
    <>
      <h2>Registration Flow</h2>
      <p>
        Test the full registration flow: register &rarr; admin accept &rarr;
        verify email + set password
      </p>

      {step === "register" && (
        <>
          <form
            className="flow-test-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleRequestRegistration();
            }}
          >
            <div className="flow-test-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flow-test-field">
              <label>First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
            <div className="flow-test-field">
              <label>Last Name</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </div>
            <div className="flow-test-actions">
              <button
                type="submit"
                className="flow-test-btn flow-test-btn-primary"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Request Registration"}
              </button>
            </div>
          </form>

          <div className="flow-test-section">
            <h3>Pending Registrations</h3>
            <p>
              Registrations awaiting admin action. Requires admin session.
            </p>
            <div className="flow-test-actions">
              <button
                className="flow-test-btn flow-test-btn-secondary"
                onClick={handleLoadPending}
                disabled={loading}
              >
                {loading ? "Loading..." : pendingLoaded ? "Refresh" : "Load Pending"}
              </button>
            </div>
            {pendingLoaded && (
              <div className="flow-test-pending">
                <PendingRegistrations
                  registrations={pendingRegs}
                  onResume={handleResume}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </>
      )}

      {step === "accept" && (
        <>
          <div className="flow-test-info">
            <strong>Email:</strong> {email}
            <br />
            <p>
              Registration created but not yet accepted. Admin must approve.
            </p>
          </div>
          <div className="flow-test-actions">
            <button
              className="flow-test-btn flow-test-btn-primary"
              onClick={handleAccept}
              disabled={loading}
            >
              {loading ? "Accepting..." : "Accept Registration (Admin)"}
            </button>
            <button
              className="flow-test-btn flow-test-btn-secondary"
              onClick={handleReset}
            >
              Start Over
            </button>
          </div>
        </>
      )}

      {step === "signup" && (
        <>
          <div className="flow-test-info">
            <strong>Registration ID:</strong> {registrationId}
            <br />
            <strong>Signup Token:</strong> {signupToken || "(none)"}
            <br />
            <strong>Email:</strong> {email}
          </div>
          <p>Renew signup, then verify your email and set a password.</p>
          <form
            className="flow-test-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCompleteSignup();
            }}
          >
            <div className="flow-test-field">
              <label>Verification Code</label>
              <div className="flow-test-input-with-button">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code from email"
                  required
                />
                <button
                  type="button"
                  className="flow-test-btn flow-test-btn-load"
                  onClick={handleLoadCode}
                  disabled={loading}
                >
                  Load
                </button>
              </div>
            </div>
            <div className="flow-test-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flow-test-actions">
              <button
                type="submit"
                className="flow-test-btn flow-test-btn-primary"
                disabled={loading || !signupToken}
              >
                {loading ? "Completing..." : "Complete Signup"}
              </button>
              <button
                type="button"
                className="flow-test-btn flow-test-btn-secondary"
                onClick={handleRenewSignup}
                disabled={loading || !registrationId}
              >
                Renew Signup
              </button>
              <button
                type="button"
                className="flow-test-btn flow-test-btn-secondary"
                onClick={handleReset}
              >
                Start Over
              </button>
            </div>
          </form>
        </>
      )}

      {step === "complete" && (
        <div className="flow-test-complete">
          <h3>Registration Complete</h3>
          <p>
            User account created, session established, and member permission
            granted.
          </p>
          <button
            className="flow-test-btn flow-test-btn-secondary"
            onClick={handleReset}
          >
            Register Another User
          </button>
        </div>
      )}

      {status && (
        <div
          className={`flow-test-status ${
            status.startsWith("Error") ? "error" : "success"
          }`}
        >
          {status}
        </div>
      )}
    </>
  );
}
