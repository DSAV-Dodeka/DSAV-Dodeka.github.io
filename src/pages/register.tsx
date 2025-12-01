import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../functions/faroe-client";
import { faroeClient } from "../functions/faroe-client";
import { setSession } from "../functions/faroe-client";
import { useRegistrationStatus } from "../functions/query";
import PageTitle from "../components/PageTitle";
import "./register.css";

export default function Register() {
  const queryClient = useQueryClient();
  // Get token from URL immediately
  const urlToken = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  }, []);

  // Use React Query to check registration status
  const {
    data: registrationStatus,
    isLoading: isCheckingStatus,
    error: statusError,
  } = useRegistrationStatus(urlToken);

  // Determine the step based on URL token and registration status
  const initialStep = useMemo(() => {
    if (urlToken) {
      if (isCheckingStatus) {
        return "checking"; // Loading state
      }
      if (statusError) {
        return "request"; // Invalid token, go to request
      }
      if (registrationStatus?.accepted && registrationStatus.signup_token) {
        return "complete-signup"; // Approved, ready to complete
      }
      return "pending"; // Valid token but not approved yet
    }
    return "request"; // No token, show request form
  }, [urlToken, isCheckingStatus, statusError, registrationStatus]);

  const [step, setStep] = useState<
    "request" | "submitted" | "pending" | "complete-signup" | "done" | "checking"
  >(initialStep);

  // Update step when initial step changes
  useMemo(() => {
    setStep(initialStep);
  }, [initialStep]);

  // Step 1: Request registration
  const [email, setEmail] = useState(registrationStatus?.email || "");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [registrationToken, setRegistrationToken] = useState(urlToken || "");

  // Step 2: Complete signup after admin approval
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [signupToken, setSignupToken] = useState(
    registrationStatus?.signup_token || ""
  );

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Set initial status message based on registration status
  useMemo(() => {
    // Don't set initial status if we're already done or in the middle of signup
    if (step === "done" || step === "checking") {
      return;
    }
    if (urlToken && registrationStatus && !status) {
      if (registrationStatus.accepted && registrationStatus.signup_token) {
        setStatus("✓ Your registration has been approved! Check your email for the verification code.");
      } else {
        setStatus("⏳ Your registration is pending admin approval. Please check back later.");
      }
    }
    if (urlToken && statusError && !status) {
      setStatus("✗ Invalid registration token. Please request a new registration.");
    }
  }, [urlToken, registrationStatus, statusError, status, step]);

  // Update email and signup token when registration status loads
  useMemo(() => {
    if (registrationStatus) {
      setEmail(registrationStatus.email);
      if (registrationStatus.signup_token) {
        setSignupToken(registrationStatus.signup_token);
      }
    }
  }, [registrationStatus]);

  const checkRegistrationStatus = async () => {
    // This is now handled by React Query, but keep for manual refresh
    window.location.reload();
  };

  const handleRequestRegistration = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await registerUser(email, firstname, lastname);
      setRegistrationToken(result.registration_token);
      setStep("submitted");
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
        // If email is already verified, continue with the flow
        if (verifyResult.errorCode !== "email_address_already_verified") {
          setStatus(`✗ Email verification failed: ${JSON.stringify(verifyResult)}`);
          setLoading(false);
          return;
        }
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

      // Invalidate session query to update login indicator
      await queryClient.invalidateQueries({ queryKey: ["session"] });

      setStep("done");
      setStatus(""); // Clear status to avoid duplicate message
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <PageTitle title="Register" />

      {step === "checking" && (
        <div className="register-header">
          <h2>Checking Registration Status...</h2>
          <div className="register-loading">
            <p>Please wait while we verify your registration token.</p>
          </div>
        </div>
      )}

      {step === "request" && (
        <>
          <div className="register-header">
            <h2>Request Registration</h2>
            <p>Submit your information to request an account. An admin will review and approve your request.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && email && firstname && lastname) {
                handleRequestRegistration();
              }
            }}
          >
            <div className="register-section">
              <div className="register-form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="register-form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="First name"
                />
              </div>
              <div className="register-form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="register-section">
              <button
                type="submit"
                disabled={loading || !email || !firstname || !lastname}
                className="register-button register-button-primary"
              >
                Submit Registration Request
              </button>
            </div>
          </form>
        </>
      )}

      {step === "submitted" && (
        <>
          <div className="register-header">
            <h2>Registration Submitted</h2>
            <p>Thank you for your registration request! An admin will review your application and you'll receive an email when your registration is approved.</p>
          </div>

          {import.meta.env.DEV && registrationToken && (
            <div className="register-section">
              <p className="register-hint" style={{ marginBottom: "10px", textAlign: "center" }}>
                Dev Mode Only: Click below to check your registration status
              </p>
              <a
                href={`/register?token=${registrationToken}`}
                className="register-button register-button-primary"
                style={{ display: "block", textDecoration: "none", textAlign: "center" }}
              >
                Go to Registration Status Page
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/register?token=${registrationToken}`);
                  setStatus("✓ Registration link copied to clipboard!");
                }}
                className="register-button register-button-secondary"
                style={{ marginTop: "10px" }}
              >
                Copy Link to Clipboard
              </button>
            </div>
          )}
        </>
      )}

      {step === "pending" && (
        <>
          <div className="register-header">
            <h2>Registration Pending</h2>
            <p>Your registration request for {email} is awaiting admin approval. You'll receive an email when approved.</p>
          </div>

          <div className="register-section">
            <button
              onClick={() => checkRegistrationStatus()}
              disabled={loading}
              className="register-button register-button-primary"
            >
              Refresh Status
            </button>
            <p className="register-hint" style={{ textAlign: "center", marginTop: "10px" }}>
              Click to check if your registration has been approved
            </p>
          </div>
        </>
      )}

      {step === "complete-signup" && (
        <>
          <div className="register-header">
            <h2>Complete Your Registration</h2>
            <p>Your registration has been approved! Check your email ({email}) for a verification code, then complete your registration below.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && signupToken && verificationCode && password) {
                handleCompleteSignup();
              }
            }}
          >
            <div className="register-section">
              <div className="register-form-group">
                <label>Verification Code:</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code from email"
                />
                <small className="register-hint">
                  Check your email at {email} for the verification code
                </small>
              </div>
              <div className="register-form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a strong password"
                />
              </div>
            </div>

            <div className="register-section">
              <button
                type="submit"
                disabled={loading || !signupToken || !verificationCode || !password}
                className="register-button register-button-primary"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </>
      )}

      {step === "done" && (
        <div className="register-complete">
          <h3>✓ Welcome!</h3>
          <p>Your account has been created successfully. You are now logged in and can start using the application.</p>
        </div>
      )}

      {status && (
        <div
          className={`register-status ${
            status.startsWith("✓")
              ? "register-status-success"
              : "register-status-error"
          }`}
        >
          {status}
        </div>
      )}

      {loading && (
        <div className="register-loading">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}
