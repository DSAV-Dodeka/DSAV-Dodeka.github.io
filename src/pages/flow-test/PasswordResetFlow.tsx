import { useState, useRef } from "react";
import { requestPasswordReset, PasswordResetFlow } from "$functions/flows/password-reset.ts";
import { TEST_EMAIL, TEST_PASSWORD } from "./constants";

export default function PasswordResetFlowTest() {
  const resetFlow = useRef(new PasswordResetFlow());
  const [step, setStep] = useState<"email" | "reset" | "complete">("email");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState(TEST_EMAIL);
  const [resetToken, setResetToken] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState(TEST_PASSWORD);

  const handleRequestReset = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await requestPasswordReset(email);
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      setResetToken(result.token);
      setStatus("✓ Reset email sent, check your inbox");
      setStep("reset");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async () => {
    setLoading(true);
    setStatus("");
    try {
      const result = await resetFlow.current.tryComplete(
        resetToken,
        tempPassword,
        newPassword
      );
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        return;
      }

      setStatus("✓ Password reset successful");
      setStep("complete");
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setStep("email");
    setStatus("");
    setResetToken("");
    setTempPassword("");
    resetFlow.current = new PasswordResetFlow();
  };

  return (
    <>
      <h2>Password Reset Flow</h2>
      <p>
        Test the password reset flow: request reset → verify temp password → set
        new password
      </p>

      {step === "email" && (
        <form
          className="flow-test-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRequestReset();
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
          <div className="flow-test-actions">
            <button
              type="submit"
              className="flow-test-btn flow-test-btn-primary"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>
          </div>
        </form>
      )}

      {step === "reset" && (
        <>
          <div className="flow-test-info">
            <strong>Reset Token:</strong> {resetToken}
            <br />
            <strong>Email:</strong> {email}
          </div>

          <p>Check Faroe console logs for the temporary password.</p>

          <form
            className="flow-test-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCompleteReset();
            }}
          >
            <div className="flow-test-field">
              <label>Temporary Password</label>
              <input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Enter temp password from email"
                required
              />
              <small style={{ color: "#666", fontSize: "12px" }}>
                Check Faroe console logs for the temporary password
              </small>
            </div>
            <div className="flow-test-field">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="flow-test-actions">
              <button
                type="submit"
                className="flow-test-btn flow-test-btn-primary"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                className="flow-test-btn flow-test-btn-secondary"
                onClick={handleStartOver}
              >
                Start Over
              </button>
            </div>
          </form>
        </>
      )}

      {step === "complete" && (
        <div className="flow-test-complete">
          <h3>✓ Password Reset Complete</h3>
          <p>Password has been successfully reset.</p>
          <button
            className="flow-test-btn flow-test-btn-secondary"
            onClick={handleStartOver}
          >
            Reset Another Password
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
