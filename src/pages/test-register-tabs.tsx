import { useState } from "react";
import {
  clearTables,
  getSessionInfo,
  clearCurrentSession,
  registerUser,
  getRegistrationStatus,
  createEmailChange,
  sendEmailVerificationCode,
  verifyEmailChange,
  verifyEmailChangePassword,
  completeEmailChange,
  type SessionInfo,
} from "../functions/faroe-client";
import {
  preregisterUser,
  createSignup as createSignupFlow,
  verifyEmail,
  setPasswordAndComplete,
  createSignin as createSigninFlow,
  verifySigninPassword,
  createPasswordReset,
  completePasswordReset,
  type RegistrationStep,
} from "../functions/auth-flow";
import { faroeClient, setSession } from "../functions/faroe-client";
import "./test-register.css";

type TabType = "register" | "prod-register" | "signin" | "password-reset" | "session";

export default function TestRegisterTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("register");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClearTables = async () => {
    setLoading(true);
    setStatus("");
    try {
      await clearTables();
      setStatus("✓ Tables cleared successfully!");
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-register-container">
      <div className="test-register-compact-header">
        <div className="test-register-title-row">
          <h1>Auth Flow Testing</h1>
          <a href="/admin" className="test-register-admin-link-compact">
            Admin Dashboard
          </a>
        </div>
        <div className="test-register-password-compact">
          <strong>Password:</strong>
          <code className="test-register-password-code">q9oyReu*^xCd</code>
        </div>
      </div>

      <div className="test-register-tabs">
        <button
          className={`test-register-tab ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Register (Test)
        </button>
        <button
          className={`test-register-tab ${activeTab === "prod-register" ? "active" : ""}`}
          onClick={() => setActiveTab("prod-register")}
        >
          Register (Prod)
        </button>
        <button
          className={`test-register-tab ${activeTab === "signin" ? "active" : ""}`}
          onClick={() => setActiveTab("signin")}
        >
          Sign In
        </button>
        <button
          className={`test-register-tab ${activeTab === "password-reset" ? "active" : ""}`}
          onClick={() => setActiveTab("password-reset")}
        >
          Password Reset
        </button>
        <button
          className={`test-register-tab ${activeTab === "session" ? "active" : ""}`}
          onClick={() => setActiveTab("session")}
        >
          Session
        </button>
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

      {activeTab === "register" && <RegisterTab status={status} setStatus={setStatus} loading={loading} setLoading={setLoading} />}
      {activeTab === "prod-register" && <ProductionRegisterTab status={status} setStatus={setStatus} loading={loading} setLoading={setLoading} />}
      {activeTab === "signin" && <SignInTab status={status} setStatus={setStatus} loading={loading} setLoading={setLoading} />}
      {activeTab === "password-reset" && <PasswordResetTab status={status} setStatus={setStatus} loading={loading} setLoading={setLoading} />}
      {activeTab === "session" && <SessionTab status={status} setStatus={setStatus} loading={loading} setLoading={setLoading} />}

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

// Register Tab Component
function RegisterTab({ setStatus, loading, setLoading }: TabProps) {
  const [email, setEmail] = useState("testuser@example.com");
  const [firstname, setFirstname] = useState("Test");
  const [lastname, setLastname] = useState("User");
  const [password, setPassword] = useState("q9oyReu*^xCd");
  const [verificationCode, setVerificationCode] = useState("");
  const [signupToken, setSignupToken] = useState<string | null>(null);
  const [step, setStep] = useState<RegistrationStep>("preregister");
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

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
    const result = await createSignupFlow(email);
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

  const handleReset = () => {
    setStep("preregister");
    setSignupToken(null);
    setVerificationCode("");
    setStatus("");
    setSessionInfo(null);
  };

  return (
    <>
      <div className="test-register-tab-header">
        <h3>Registration Flow <span className="test-register-current-step">({step})</span></h3>
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
          <p>You are now registered and logged in. Session cookie has been set.</p>
          <button
            onClick={handleGetSession}
            disabled={loading}
            className="test-register-button test-register-button-signup test-register-spacing-bottom"
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
    </>
  );
}

// Production Register Tab Component (with admin approval)
function ProductionRegisterTab({ setStatus, loading, setLoading }: TabProps) {
  const [step, setStep] = useState<"request" | "check-status" | "complete">("request");

  // Step 1: Request registration
  const [email, setEmail] = useState("produser@example.com");
  const [firstname, setFirstname] = useState("Prod");
  const [lastname, setLastname] = useState("User");
  const [registrationToken, setRegistrationToken] = useState("");

  // For checking status with existing token
  const [checkToken, setCheckToken] = useState("");

  // Step 2: Complete signup (after admin accepts)
  const [signupToken, setSignupToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("q9oyReu*^xCd");

  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  const handleRequestRegistration = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await registerUser(email, firstname, lastname);
      setRegistrationToken(result.registration_token);
      setStatus(`✓ ${result.message}\n\nSave your registration token to check status later!`);
      setStep("check-status");
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (token: string) => {
    setLoading(true);
    setStatus("");
    try {
      const statusResult = await getRegistrationStatus(token);

      if (statusResult.accepted && statusResult.signup_token) {
        setSignupToken(statusResult.signup_token);
        setEmail(statusResult.email);
        setStatus(`✓ Registration approved! Check your email (${statusResult.email}) for verification code.`);
        setStep("complete");
      } else {
        setStatus(`Registration for ${statusResult.email} is pending admin approval. Check back later!`);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    setLoading(true);
    setStatus("");

    try {
      // Step 1: Verify email with code
      const verifyResult = await faroeClient.verifySignupEmailAddressVerificationCode(
        signupToken,
        verificationCode
      );

      if (!verifyResult.ok) {
        setStatus(`✗ Email verification failed: ${JSON.stringify(verifyResult)}`);
        setLoading(false);
        return;
      }

      // Step 2: Set password
      const setPasswordResult = await faroeClient.setSignupPassword(signupToken, password);

      if (!setPasswordResult.ok) {
        setStatus(`✗ Set password failed: ${JSON.stringify(setPasswordResult)}`);
        setLoading(false);
        return;
      }

      // Step 3: Complete signup
      const completeResult = await faroeClient.completeSignup(signupToken);

      if (!completeResult.ok) {
        setStatus(`✗ Complete signup failed: ${JSON.stringify(completeResult)}`);
        setLoading(false);
        return;
      }

      // Step 4: Set session cookie
      await setSession(completeResult.sessionToken);

      setStatus("✓ Registration complete! You are now logged in.");
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
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

  const handleReset = () => {
    setStep("request");
    setSignupToken("");
    setVerificationCode("");
    setStatus("");
    setSessionInfo(null);
  };

  return (
    <>
      <div className="test-register-tab-header">
        <h3>Production Registration <span className="test-register-current-step">({step === "request" ? "Request" : step === "check-status" ? "Check Status" : "Complete"})</span></h3>
      </div>

      {step === "request" && (
        <>
          <div className="test-register-section">
            <h3>Step 1: User Registration Request</h3>
            <div className="test-register-form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="test-register-form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="test-register-form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          <div className="test-register-section">
            <button
              onClick={handleRequestRegistration}
              disabled={loading}
              className="test-register-button test-register-button-preregister"
            >
              Submit Registration Request
            </button>
            <p className="test-register-step-description">
              Creates newuser entry with accepted=false
            </p>
          </div>

          <div className="test-register-section">
            <button
              onClick={() => setStep("check-status")}
              className="test-register-button test-register-button-next test-register-spacing-top"
            >
              Already have a registration token? Check Status →
            </button>
          </div>
        </>
      )}

      {step === "check-status" && (
        <>
          <div className="test-register-section">
            <h3>Step 2: Registration Token</h3>
            <p className="test-register-step-description">
              Save this token to check your registration status later!
            </p>
            <div className="test-register-form-group">
              <label>Your Registration Token:</label>
              <div className="test-register-input-with-button">
                <input
                  type="text"
                  value={registrationToken}
                  readOnly
                  className="test-register-token-display"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(registrationToken);
                    setStatus("✓ Registration token copied to clipboard!");
                  }}
                  className="test-register-copy-button"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              </div>
            </div>
            <p className="test-register-step-description">
              An admin must approve your registration. Once approved, you'll receive a verification email.
            </p>
          </div>

          <div className="test-register-section">
            <h3>Check Registration Status</h3>
            <p className="test-register-step-description">
              Already have a registration token? Enter it here to check if you've been approved.
            </p>
            <div className="test-register-form-group">
              <label>Registration Token:</label>
              <input
                type="text"
                value={checkToken}
                onChange={(e) => setCheckToken(e.target.value)}
                placeholder="Enter your registration token"
              />
            </div>
            <button
              onClick={() => handleCheckStatus(checkToken || registrationToken)}
              disabled={loading || (!checkToken && !registrationToken)}
              className="test-register-button test-register-button-signup"
            >
              Check Status
            </button>
            <p className="test-register-step-description">
              If approved, you'll proceed to complete your registration with the verification code.
            </p>
          </div>

          <div className="test-register-section">
            <button
              onClick={() => {
                setStep("request");
                setCheckToken("");
                setRegistrationToken("");
              }}
              className="test-register-button test-register-button-next test-register-spacing-top"
            >
              ← Back to New Registration
            </button>
          </div>
        </>
      )}

      {step === "complete" && (
        <>
          <div className="test-register-section">
            <h3>Step 3: User Completes Registration</h3>
            <div className="test-register-form-group">
              <label>Signup Token:</label>
              <input
                type="text"
                value={signupToken}
                onChange={(e) => setSignupToken(e.target.value)}
                disabled
              />
              <small className="test-register-step-description">Auto-filled from registration status</small>
            </div>
            <div className="test-register-form-group">
              <label>Verification Code:</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code from email"
              />
            </div>
            <div className="test-register-form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="test-register-section">
            <button
              onClick={handleCompleteSignup}
              disabled={loading || !verificationCode}
              className="test-register-button test-register-button-password"
            >
              Complete Registration
            </button>
            <p className="test-register-step-description">
              Verifies email, sets password, and logs in
            </p>
          </div>

          {sessionInfo && (
            <>
              <div className="test-register-complete">
                <h3>✓ Registration Complete!</h3>
                <p>Session has been established.</p>
                <button
                  onClick={handleGetSession}
                  disabled={loading}
                  className="test-register-button test-register-button-signup test-register-spacing-bottom"
                >
                  Refresh Session Info
                </button>
                <button
                  onClick={handleReset}
                  className="test-register-button test-register-button-next"
                >
                  Register Another User
                </button>
              </div>

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
            </>
          )}

          {!sessionInfo && (
            <div className="test-register-section">
              <button
                onClick={handleGetSession}
                disabled={loading}
                className="test-register-button test-register-button-signup"
              >
                Get Session Info
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

// Sign In Tab Component
function SignInTab({ setStatus, loading, setLoading }: TabProps) {
  const [email, setEmail] = useState("testuser@example.com");
  const [password, setPassword] = useState("q9oyReu*^xCd");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setStatus("");

    // Step 1: Create signin
    const signinResult = await createSigninFlow(email);
    if (!signinResult.success || !signinResult.signupToken) {
      setStatus(signinResult.message);
      setLoading(false);
      return;
    }

    // Step 2: Verify password
    const verifyResult = await verifySigninPassword(signinResult.signupToken, password);
    setStatus(verifyResult.message);
    if (verifyResult.success) {
      setIsSignedIn(true);
    }
    setLoading(false);
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

  const handleReset = () => {
    setIsSignedIn(false);
    setStatus("");
    setSessionInfo(null);
  };

  return (
    <>
      <div className="test-register-tab-header">
        <h3>Sign In Flow</h3>
      </div>

      {!isSignedIn ? (
        <>
          <div className="test-register-section">
            <h3>Sign In Details</h3>
            <div className="test-register-form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="test-register-form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="test-register-section">
            <button
              onClick={handleSignIn}
              disabled={loading || !email || !password}
              className="test-register-button test-register-button-signup"
            >
              Sign In
            </button>
            <p className="test-register-step-description">
              Verifies credentials and completes sign in
            </p>
          </div>
        </>
      ) : (
        <div className="test-register-complete">
          <h3>✓ Signed In Successfully!</h3>
          <p>Session cookie has been set.</p>
          <button
            onClick={handleGetSession}
            disabled={loading}
            className="test-register-button test-register-button-signup test-register-spacing-bottom"
          >
            Get Session Info
          </button>
          <button
            onClick={handleReset}
            className="test-register-button test-register-button-next"
          >
            Sign In Again
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
        </div>
      )}
    </>
  );
}

// Password Reset Tab Component
function PasswordResetTab({ setStatus, loading, setLoading }: TabProps) {
  const [email, setEmail] = useState("testuser@example.com");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("newPassword123!");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "reset" | "complete">("email");

  const handleCreateReset = async () => {
    setLoading(true);
    setStatus("");
    const result = await createPasswordReset(email);
    setStatus(result.message);
    if (result.success && result.signupToken) {
      setResetToken(result.signupToken);
      setStep("reset");
    }
    setLoading(false);
  };

  const handleCompleteReset = async () => {
    if (!resetToken) {
      setStatus("✗ No reset token available");
      return;
    }

    setLoading(true);
    setStatus("");
    const result = await completePasswordReset(resetToken, tempPassword, newPassword);
    setStatus(result.message);
    if (result.success) {
      setStep("complete");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setStep("email");
    setResetToken(null);
    setTempPassword("");
    setStatus("");
  };

  return (
    <>
      <div className="test-register-tab-header">
        <h3>Password Reset <span className="test-register-current-step">({step})</span></h3>
      </div>

      <div className="test-register-section">
        <h3>Password Reset Details</h3>
        <div className="test-register-form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step !== "email"}
          />
        </div>
      </div>

      {step === "email" && (
        <div className="test-register-section">
          <button
            onClick={handleCreateReset}
            disabled={loading}
            className="test-register-button test-register-button-verify"
          >
            Step 1: Request Password Reset
          </button>
          <p className="test-register-step-description">
            Sends temporary password via email
          </p>
        </div>
      )}

      {step === "reset" && (
        <div className="test-register-section">
          <div className="test-register-form-group">
            <label>Temporary Password:</label>
            <input
              type="text"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              placeholder="From email"
            />
          </div>
          <div className="test-register-form-group">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleCompleteReset}
            disabled={loading || !tempPassword || !newPassword}
            className="test-register-button test-register-button-password"
          >
            Step 2: Complete Password Reset
          </button>
          <p className="test-register-step-description">
            Check SMTP logs for temporary password
          </p>
        </div>
      )}

      {step === "complete" && (
        <div className="test-register-complete">
          <h3>✓ Password Reset Complete!</h3>
          <p>You can now sign in with your new password.</p>
          <button
            onClick={handleReset}
            className="test-register-button test-register-button-next"
          >
            Reset Another Password
          </button>
        </div>
      )}
    </>
  );
}

// Session Tab Component
function SessionTab({ setStatus, loading, setLoading }: TabProps) {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [sessionToken, setSessionToken] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailUpdateToken, setEmailUpdateToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [emailChangeStep, setEmailChangeStep] = useState<"idle" | "verify-code" | "verify-password" | "done">("idle");

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

  const handleClearCurrentSession = async () => {
    setLoading(true);
    setStatus("");
    try {
      await clearCurrentSession();
      setStatus("✓ Current session cleared successfully!");
      setSessionInfo(null);
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToken) {
      setStatus("✗ Please enter a session token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await faroeClient.deleteSession(sessionToken);
      if (result.ok) {
        setStatus("✓ Session deleted successfully!");
        setSessionInfo(null);
      } else {
        setStatus(`✗ Delete session failed: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllSessions = async () => {
    if (!sessionToken) {
      setStatus("✗ Please enter a session token");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const result = await faroeClient.deleteAllSessions(sessionToken);
      if (result.ok) {
        setStatus("✓ All sessions deleted successfully!");
        setSessionInfo(null);
      } else {
        setStatus(`✗ Delete all sessions failed: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEmailChange = async () => {
    if (!newEmail) {
      setStatus("✗ Please enter a new email");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      const token = await createEmailChange(newEmail);
      setEmailUpdateToken(token);
      await sendEmailVerificationCode(token);
      setEmailChangeStep("verify-code");
      setStatus("✓ Verification code sent! Check your email.");
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setStatus("✗ Please enter the verification code");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      await verifyEmailChange(emailUpdateToken, verificationCode);
      setEmailChangeStep("verify-password");
      setStatus("✓ Email verified! Now enter your password to confirm.");
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPasswordAndComplete = async () => {
    if (!password) {
      setStatus("✗ Please enter your password");
      return;
    }

    setLoading(true);
    setStatus("");
    try {
      await verifyEmailChangePassword(emailUpdateToken, password);
      await completeEmailChange(emailUpdateToken);
      setEmailChangeStep("done");
      setStatus("✓ Email changed successfully!");
      // Refresh session info
      const session = await getSessionInfo();
      if (session) {
        setSessionInfo(session);
      }
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetEmailChange = () => {
    setEmailChangeStep("idle");
    setNewEmail("");
    setEmailUpdateToken("");
    setVerificationCode("");
    setPassword("");
    setStatus("");
  };

  return (
    <>
      <div className="test-register-tab-header">
        <h3>Session Management</h3>
      </div>

      <div className="test-register-section">
        <h3>Current Session (from cookie)</h3>
        <button
          onClick={handleGetSession}
          disabled={loading}
          className="test-register-button test-register-button-signup test-register-spacing-bottom"
        >
          Get Session Info
        </button>
        <button
          onClick={handleClearCurrentSession}
          disabled={loading}
          className="test-register-button test-register-button-reset"
        >
          Clear Current Session
        </button>
      </div>

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

      <div className="test-register-section">
        <h3>Change Email</h3>
        {emailChangeStep === "idle" && (
          <>
            <div className="test-register-form-group">
              <label>New Email:</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new.email@example.com"
              />
            </div>
            <button
              onClick={handleStartEmailChange}
              disabled={loading || !newEmail}
              className="test-register-button test-register-button-signup"
            >
              Send Verification Code
            </button>
          </>
        )}
        {emailChangeStep === "verify-code" && (
          <>
            <p className="test-register-spacing-bottom">
              Verification code sent to <strong>{newEmail}</strong>
            </p>
            <div className="test-register-form-group">
              <label>Verification Code:</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code from email"
              />
            </div>
            <div className="test-register-button-group">
              <button
                onClick={handleVerifyCode}
                disabled={loading || !verificationCode}
                className="test-register-button test-register-button-verify"
              >
                Verify Code
              </button>
              <button
                onClick={handleResetEmailChange}
                disabled={loading}
                className="test-register-button test-register-button-reset"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {emailChangeStep === "verify-password" && (
          <>
            <p className="test-register-spacing-bottom">
              Email verified! Now enter your current password to confirm the change.
            </p>
            <div className="test-register-form-group">
              <label>Current Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div className="test-register-button-group">
              <button
                onClick={handleVerifyPasswordAndComplete}
                disabled={loading || !password}
                className="test-register-button test-register-button-verify"
              >
                Confirm and Complete
              </button>
              <button
                onClick={handleResetEmailChange}
                disabled={loading}
                className="test-register-button test-register-button-reset"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {emailChangeStep === "done" && (
          <>
            <p className="test-register-text-success">
              ✓ Email successfully changed to {newEmail}!
            </p>
            <button
              onClick={handleResetEmailChange}
              className="test-register-button test-register-button-signup"
            >
              Change Email Again
            </button>
          </>
        )}
      </div>

      <div className="test-register-section">
        <h3>Session Operations</h3>
        <div className="test-register-form-group">
          <label>Session Token:</label>
          <input
            type="text"
            value={sessionToken}
            onChange={(e) => setSessionToken(e.target.value)}
            placeholder="Paste session token"
          />
        </div>
        <button
          onClick={handleDeleteSession}
          disabled={loading || !sessionToken}
          className="test-register-button test-register-button-verify test-register-spacing-bottom"
        >
          Delete This Session
        </button>
        <button
          onClick={handleDeleteAllSessions}
          disabled={loading || !sessionToken}
          className="test-register-button test-register-button-reset"
        >
          Delete All Sessions
        </button>
      </div>
    </>
  );
}

interface TabProps {
  status: string;
  setStatus: (status: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
