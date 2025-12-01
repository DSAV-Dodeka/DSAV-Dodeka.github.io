import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createSignin, verifySigninPassword } from "../functions/auth-flow";
import PageTitle from "../components/PageTitle";
import "./register.css";

export default function Login() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setStatus("");

    try {
      // Step 1: Create signin
      const signinResult = await createSignin(email);

      if (!signinResult.success || !signinResult.signupToken) {
        setStatus(signinResult.message);
        setLoading(false);
        return;
      }

      // Step 2: Verify password (this also sets the session)
      const verifyResult = await verifySigninPassword(signinResult.signupToken, password);
      setStatus(verifyResult.message);

      if (!verifyResult.success) {
        setLoading(false);
        return;
      }

      // Invalidate session query to update login indicator
      await queryClient.invalidateQueries({ queryKey: ["session"] });

      // Redirect to home after short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      setStatus(`✗ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <PageTitle title="Login" />

      <div className="register-header">
        <h2>Login to Your Account</h2>
        <p>Enter your email and password to access your account.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading && email && password) {
            handleSignIn();
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
          <div className="register-form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="register-section">
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="register-button register-button-primary"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="register-section register-link-section">
        <a href="/password-reset" className="register-link">
          Forgot your password?
        </a>
      </div>

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
