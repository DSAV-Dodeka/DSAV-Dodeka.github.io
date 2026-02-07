import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as api from "$functions/backend.ts";
import type { NewUser } from "$functions/backend.ts";
import { SignupFlow } from "$functions/flows/signup.ts";
import PendingRegistrations from "$components/PendingRegistrations.tsx";
import { TEST_EMAIL, TEST_FIRSTNAME, TEST_LASTNAME, TEST_PASSWORD } from "./constants";

export default function RegisterFlow() {
  const queryClient = useQueryClient();
  const signupFlow = useRef(new SignupFlow());
  const [step, setStep] = useState<
    "register" | "signup" | "pending_approval" | "complete"
  >("register");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState(TEST_EMAIL);
  const [firstname, setFirstname] = useState(TEST_FIRSTNAME);
  const [lastname, setLastname] = useState(TEST_LASTNAME);
  const [registrationToken, setRegistrationToken] = useState("");
  const [signupToken, setSignupToken] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState(TEST_PASSWORD);

  // Pending registrations state
  const [pendingUsers, setPendingUsers] = useState<NewUser[]>([]);
  const [pendingLoaded, setPendingLoaded] = useState(false);

  const handleRequestRegistration = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await api.requestRegistration(email, firstname, lastname);
      setRegistrationToken(result.registration_token);
      if (result.signup_token) {
        setSignupToken(result.signup_token);
      }
      setStatus("✓ Registration requested, verification email sent");
      setStep("signup");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPending = async () => {
    setLoading(true);
    setStatus("");
    try {
      const users = await api.listNewUsers();
      setPendingUsers(users);
      setPendingLoaded(true);
      setStatus(`✓ Loaded ${users.length} newusers`);
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async (user: NewUser) => {
    setLoading(true);
    setStatus("");
    try {
      setEmail(user.email);

      if (user.is_registered && !user.accepted) {
        // User completed signup but needs admin acceptance
        setStatus(`✓ Resumed for ${user.email} (pending acceptance)`);
        setStep("pending_approval");
      } else if (user.is_registered && user.accepted) {
        // User is fully complete
        setStatus(`✓ ${user.email} is already complete`);
        setStep("complete");
      } else if (!user.is_registered && user.registration_token) {
        // User needs to complete email verification + signup
        setRegistrationToken(user.registration_token);

        // Get current signup token (may still be valid)
        const regStatus = await api.getRegistrationStatus(
          user.registration_token,
        );
        if (regStatus.signup_token) {
          setSignupToken(regStatus.signup_token);
        }

        setStatus(`✓ Resumed registration for ${user.email}`);
        setStep("signup");
      } else {
        setStatus("✗ Cannot resume: no registration token found");
      }
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
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

  const handleRenewSignup = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await api.renewSignup(registrationToken);
      setSignupToken(result.signup_token);
      setVerificationCode("");
      signupFlow.current = new SignupFlow();
      setStatus("✓ Signup renewed, new verification email sent");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
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
            "✗ Signup token expired. Click 'Renew Signup' to get a new one.",
          );
          return;
        }
        setStatus(`✗ ${result.error}`);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      // Check if user was already accepted (e.g. by admin or sync)
      const session = await api.getSessionInfo();
      if (session?.user.permissions.includes("member")) {
        setStatus("✓ Signup complete (already accepted, member permission granted)");
        setStep("complete");
      } else {
        setStatus("✓ Signup complete (no member permission yet)");
        setStep("pending_approval");
      }
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptUser = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await api.acceptUser(email);
      setStatus(`✓ ${result.message}`);
      setStep("complete");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("register");
    setStatus("");
    setRegistrationToken("");
    setSignupToken("");
    setVerificationCode("");
    signupFlow.current = new SignupFlow();
  };

  return (
    <>
      <h2>Registration Flow</h2>
      <p>
        Test the full registration flow: register → verify email + set password
        → admin approve
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

          <div style={{ marginTop: "30px" }}>
            <h3>Pending Registrations</h3>
            <p>
              Users who registered but haven't verified their email yet. Requires
              admin session.
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
              <div style={{ marginTop: "10px" }}>
                <PendingRegistrations
                  users={pendingUsers}
                  onResume={handleResume}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </>
      )}

      {step === "signup" && (
        <>
          <div className="flow-test-info">
            <strong>Registration Token:</strong> {registrationToken}
            <br />
            <strong>Signup Token:</strong> {signupToken || "(none)"}
            <br />
            <strong>Email:</strong> {email}
          </div>
          <p>Verify your email and set a password to complete signup.</p>
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
                disabled={loading}
              >
                {loading ? "Completing..." : "Complete Signup"}
              </button>
              <button
                type="button"
                className="flow-test-btn flow-test-btn-secondary"
                onClick={handleRenewSignup}
                disabled={loading}
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

      {step === "pending_approval" && (
        <>
          <div className="flow-test-info">
            <strong>Email:</strong> {email}
            <br />
            <p>
              Account created but without member permission. Admin must approve.
            </p>
          </div>
          <div className="flow-test-actions">
            <button
              className="flow-test-btn flow-test-btn-primary"
              onClick={handleAcceptUser}
              disabled={loading}
            >
              {loading ? "Accepting..." : "Accept User (Admin)"}
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

      {step === "complete" && (
        <div className="flow-test-complete">
          <h3>✓ Registration Complete</h3>
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
            status.startsWith("✓") ? "success" : "error"
          }`}
        >
          {status}
        </div>
      )}
    </>
  );
}
