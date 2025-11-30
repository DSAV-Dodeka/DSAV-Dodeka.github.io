import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createPasswordReset, completePasswordReset } from "../functions/auth-flow";
import { setSession } from "../functions/faroe-client";
import PageTitle from "../components/PageTitle";
import "./register.css";

export default function PasswordReset() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "reset" | "complete">("email");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleRequestReset = async () => {
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

  const handleStartOver = () => {
    setStep("email");
    setResetToken(null);
    setTempPassword("");
    setNewPassword("");
    setEmail("");
    setStatus("");
  };

  return (
    <div className="register-container">
      <PageTitle title="Reset Password" />

      {step === "email" && (
        <>
          <div className="register-header">
            <h2>Reset Your Password</h2>
            <p>Enter your email address to receive a temporary password.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && email) {
                handleRequestReset();
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
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="register-section">
              <button
                type="submit"
                disabled={loading || !email}
                className="register-button register-button-primary"
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </div>
          </form>
        </>
      )}

      {step === "reset" && (
        <>
          <div className="register-header">
            <h2>Complete Password Reset</h2>
            <p>Check your email ({email}) for a temporary password, then choose a new password.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading && tempPassword && newPassword) {
                handleCompleteReset();
              }
            }}
          >
            <div className="register-section">
              <div className="register-form-group">
                <label>Temporary Password:</label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Enter temporary password from email"
                />
                <small className="register-hint">
                  Check your email for the temporary password
                </small>
              </div>
              <div className="register-form-group">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Choose a new password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="register-section">
              <button
                type="submit"
                disabled={loading || !tempPassword || !newPassword}
                className="register-button register-button-primary"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </>
      )}

      {step === "complete" && (
        <div className="register-complete">
          <h3>✓ Password Reset Complete!</h3>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
          <div className="register-section">
            <button
              onClick={() => window.location.href = "/login"}
              className="register-button register-button-primary"
            >
              Go to Login
            </button>
          </div>
          <div className="register-section">
            <button
              onClick={handleStartOver}
              className="register-button register-button-secondary"
            >
              Reset Another Password
            </button>
          </div>
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
    </div>
  );
}
