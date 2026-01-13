import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as api from "$functions/backend.ts";
import { SignupFlow } from "$functions/flows/signup.ts";
import { TEST_EMAIL, TEST_FIRSTNAME, TEST_LASTNAME, TEST_PASSWORD } from "./constants";

export default function RegisterFlow() {
  const queryClient = useQueryClient();
  const signupFlow = useRef(new SignupFlow());
  const [step, setStep] = useState<"form" | "pending" | "complete">("form");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState(TEST_EMAIL);
  const [firstname, setFirstname] = useState(TEST_FIRSTNAME);
  const [lastname, setLastname] = useState(TEST_LASTNAME);
  const [registrationToken, setRegistrationToken] = useState("");
  const [signupToken, setSignupToken] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState(TEST_PASSWORD);

  const handleRequestRegistration = async () => {
    setLoading(true);
    setStatus("");
    try {
      const token = await api.requestRegistration(email, firstname, lastname);
      setRegistrationToken(token);
      setStatus("✓ Registration requested");
      setStep("pending");
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
      setSignupToken(result.signup_token);
      setStatus("✓ User accepted, verification email sent");
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
        setStatus(`✗ ${result.error}`);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      setStatus("✓ Signup complete, session established");
      setStep("complete");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("form");
    setStatus("");
    setRegistrationToken("");
    setSignupToken("");
    setVerificationCode("");
    signupFlow.current = new SignupFlow();
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

  return (
    <>
      <h2>Registration Flow</h2>
      <p>
        Test the full registration flow: request → admin accept → complete
        signup
      </p>

      {step === "form" && (
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
      )}

      {step === "pending" && (
        <>
          <div className="flow-test-info">
            <strong>Registration Token:</strong> {registrationToken}
            <br />
            <strong>Email:</strong> {email}
          </div>

          {!signupToken ? (
            <>
              <p>Admin must accept this registration to proceed.</p>
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
          ) : (
            <>
              <div className="flow-test-info">
                <strong>Signup Token:</strong> {signupToken}
              </div>
              <p>Check email for verification code, then complete signup.</p>
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
                    onClick={handleReset}
                  >
                    Start Over
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      )}

      {step === "complete" && (
        <div className="flow-test-complete">
          <h3>✓ Registration Complete</h3>
          <p>User account created and session established.</p>
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
