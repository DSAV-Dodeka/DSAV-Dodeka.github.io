import { useState } from "react";
import {
  clearTables,
  getSessionInfo,
  type SessionInfo,
} from "../functions/faroe-client";
import {
  preregisterUser,
  createSignup,
  verifyEmail,
  setPasswordAndComplete,
  type RegistrationStep,
} from "../functions/auth-flow";
import PageTitle from "../components/PageTitle";
import "./test-register.css";

export default function TestRegister() {
  const [email, setEmail] = useState("testuser@example.com");
  const [firstname, setFirstname] = useState("Test");
  const [lastname, setLastname] = useState("User");
  const [password, setPassword] = useState("q9oyReu*^xCd");
  const [verificationCode, setVerificationCode] = useState("");

  const [signupToken, setSignupToken] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<RegistrationStep>("preregister");
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  const handleClearTables = async () => {
    setLoading(true);
    setStatus("");
    try {
      await clearTables();
      setStatus("✓ Tables cleared successfully!");
      setStep("preregister");
      setSignupToken(null);
      setVerificationCode("");
    } catch (error) {
      setStatus(
        `✗ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreregister = async () => {
    setLoading(true);
    setStatus("");
    const result = await preregisterUser(email, firstname, lastname);
    setStatus(result.message);
    if (result.success && result.nextStep) {
      setStep(result.nextStep);
    }
    setLoading(false);
  };

  const handleCreateSignup = async () => {
    setLoading(true);
    setStatus("");
    const result = await createSignup(email);
    setStatus(result.message);
    if (result.success) {
      if (result.signupToken) {
        setSignupToken(result.signupToken);
      }
      if (result.nextStep) {
        setStep(result.nextStep);
      }
    }
    setLoading(false);
  };

  const handleVerifyEmail = async () => {
    if (!signupToken) {
      setStatus("✗ No signup token available");
      return;
    }

    setLoading(true);
    setStatus("");
    const result = await verifyEmail(signupToken, verificationCode);
    setStatus(result.message);
    if (result.success && result.nextStep) {
      setStep(result.nextStep);
    }
    setLoading(false);
  };

  const handleSetPassword = async () => {
    if (!signupToken) {
      setStatus("✗ No signup token available");
      return;
    }

    setLoading(true);
    setStatus("");
    const result = await setPasswordAndComplete(signupToken, password);
    setStatus(result.message);
    if (result.success && result.nextStep) {
      setStep(result.nextStep);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep("preregister");
    setSignupToken(null);
    setVerificationCode("");
    setStatus("");
    setSessionInfo(null);
  };

  const handleGetSession = async () => {
    setLoading(true);
    setStatus("");
    try {
      const session = await getSessionInfo();
      if (session) {
        setSessionInfo(session);
        setStatus("✓ Session info retrieved successfully!");
      } else {
        setStatus("✗ No active session found");
      }
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-register-container">
      <PageTitle title="Test Registration" />

      <div className="test-register-header">
        <h2>Test Registration Flow</h2>
        <p>
          <strong>Current Step:</strong> {step}
        </p>
        <p className="test-register-step-info">
          This page walks through the complete registration flow: Pre-register →
          Signup → Verify Email → Set Password → Complete
        </p>
      </div>

      <div className="test-register-section">
        <button
          onClick={handleClearTables}
          disabled={loading}
          className="test-register-button test-register-button-reset"
        >
          Clear All Tables (Reset)
        </button>
      </div>

      <div className="test-register-section">
        <h3>User Details</h3>
        <div className="test-register-form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step !== "preregister"}
          />
        </div>
        <div className="test-register-form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            disabled={step !== "preregister"}
          />
        </div>
        <div className="test-register-form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            disabled={step !== "preregister"}
          />
        </div>
      </div>

      {step === "preregister" && (
        <div className="test-register-section">
          <button
            onClick={handlePreregister}
            disabled={loading}
            className="test-register-button test-register-button-preregister"
          >
            Step 1: Pre-register User
          </button>
          <p className="test-register-step-description">
            Creates entry in newusers table with accepted=true
          </p>
        </div>
      )}

      {step === "signup" && (
        <div className="test-register-section">
          <button
            onClick={handleCreateSignup}
            disabled={loading}
            className="test-register-button test-register-button-signup"
          >
            Step 2: Create Signup (Faroe)
          </button>
          <p className="test-register-step-description">
            Starts Faroe signup flow and sends verification email
          </p>
        </div>
      )}

      {step === "verify" && (
        <div className="test-register-section">
          <div className="test-register-form-group">
            <label>Verification Code:</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter code from email"
            />
          </div>
          <button
            onClick={handleVerifyEmail}
            disabled={loading || !verificationCode}
            className="test-register-button test-register-button-verify"
          >
            Step 3: Verify Email
          </button>
          <p className="test-register-step-description">
            Check SMTP server logs or email for the verification code
          </p>
        </div>
      )}

      {step === "password" && (
        <div className="test-register-section">
          <div className="test-register-form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleSetPassword}
            disabled={loading || !password}
            className="test-register-button test-register-button-password"
          >
            Step 4: Set Password & Complete
          </button>
          <p className="test-register-step-description">
            Sets password and completes registration
          </p>
        </div>
      )}

      {step === "complete" && (
        <div className="test-register-complete">
          <h3>✓ Registration Complete!</h3>
          <p>
            You are now registered and logged in. Session cookie has been set.
          </p>
          <button
            onClick={handleGetSession}
            disabled={loading}
            className="test-register-button test-register-button-signup"
            style={{ marginBottom: "10px" }}
          >
            Get Session Info
          </button>
          <button
            onClick={handleReset}
            className="test-register-button test-register-button-next"
          >
            Register Another User
          </button>
        </div>
      )}

      {sessionInfo && (
        <div className="test-register-session-info">
          <h3>Session Information</h3>
          <div className="test-register-session-detail">
            <strong>User ID:</strong> {sessionInfo.user.user_id}
          </div>
          <div className="test-register-session-detail">
            <strong>Email:</strong> {sessionInfo.user.email}
          </div>
          <div className="test-register-session-detail">
            <strong>Name:</strong> {sessionInfo.user.firstname}{" "}
            {sessionInfo.user.lastname}
          </div>
          <div className="test-register-session-detail">
            <strong>Permissions:</strong>{" "}
            {sessionInfo.user.permissions.length > 0
              ? sessionInfo.user.permissions.join(", ")
              : "None"}
          </div>
          <div className="test-register-session-detail">
            <strong>Created At:</strong>{" "}
            {new Date(sessionInfo.created_at * 1000).toLocaleString()}
          </div>
          <div className="test-register-session-detail">
            <strong>Expires At:</strong>{" "}
            {sessionInfo.expires_at
              ? new Date(sessionInfo.expires_at * 1000).toLocaleString()
              : "Never (no expiration)"}
          </div>
        </div>
      )}

      {status && (
        <div
          className={`test-register-status ${
            status.startsWith("✓")
              ? "test-register-status-success"
              : "test-register-status-error"
          }`}
        >
          {status}
        </div>
      )}

      {loading && (
        <div className="test-register-loading">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}
