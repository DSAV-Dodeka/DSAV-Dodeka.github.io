import { useState } from "react";
import { SessionInfo, useSessionInfo } from "$functions/query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router";
import { login } from "$functions/flows/login.ts";
import PageTitle from "$components/PageTitle.tsx";
import "./login.css";

function computeState(
  session: SessionInfo | null | undefined,
  pressedLogin: boolean,
) {
  if (session != null) {
    return "logged_in";
  }

  if (pressedLogin) {
    // We know session == null
    return "in_process";
  } else {
    return "not_started";
  }
}

export default function Login() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [pressedLogin, setPressedLogin] = useState(false);
  const [status, setStatus] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data: session, error } = useSessionInfo();

  if (error !== null) {
    setStatus(`✗ ${error.message}`);
    setPressedLogin(false);
  }

  const state = computeState(session, pressedLogin);

  if (state == "logged_in") {
    setTimeout(() => {
      // Send to homepage
      navigate("/");
    }, 200);
  }

  const handleLogin = async () => {
    if (state == "logged_in") {
      return;
    }
    setPressedLogin(true);
    setStatus("");

    try {
      const result = await login(email, password);
      if (!result.ok) {
        setStatus(`✗ ${result.error}`);
        setPressedLogin(false);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["session"] });
    } catch (error) {
      setStatus(`✗ ${error instanceof Error ? error.message : String(error)}`);
      setPressedLogin(false);
    }
  };

  let loginButtonText;
  if (state === "logged_in") {
    loginButtonText = "Logged in";
  } else if (state === "in_process") {
    loginButtonText = "Logging in...";
  } else {
    loginButtonText = "Log in";
  }

  return (
    <div className="login-container">
      <PageTitle title="Login" />

      <div className="login-header">
        <h2>Login to Your Account</h2>
        <p>Enter your email and password to access your account.</p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="login-section">
          <div className="login-form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              autoComplete="email"
            />
          </div>
          <div className="login-form-group">
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

        <div className="login-section">
          <button
            type="submit"
            disabled={
              state === "in_process" ||
              state === "logged_in" ||
              !email ||
              !password
            }
            className="login-button login-button-primary"
          >
            {loginButtonText}
          </button>
        </div>
      </form>

      <div className="login-section login-link-section">
        <Link to="/account/password-reset" className="login-link">
          Forgot your password?
        </Link>
      </div>

      {status && (
        <div
          className={`login-status ${
            status.startsWith("✓")
              ? "login-status-success"
              : "login-status-error"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
