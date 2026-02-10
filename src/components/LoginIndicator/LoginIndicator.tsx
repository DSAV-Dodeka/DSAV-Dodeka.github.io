import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useSessionInfo } from "$functions/query.ts";
import loginIcon from "$images/login/login.png";
import ingelogdIcon from "$images/login/ingelogd.png";
import "./LoginIndicator.css";

const LoginIndicator = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything until we're on the client side
  if (!isClient) {
    return null;
  }

  return <LoginIndicatorClient />;
};

// Login indicator behavior:
// - Shows nothing while the session query is loading
// - Shows nothing if the backend is unreachable (network error / server down)
// - Only once /auth/session_info/ returns a successful response (proving the
//   server exists), chooses between the logged-in icon and the login icon
// This ensures the site works gracefully when the backend is down, without
// showing a misleading "Login" link that would lead to a broken login page.
const LoginIndicatorClient = () => {
  const { data: session, isLoading, isError } = useSessionInfo();

  if (isLoading || isError) {
    return null;
  }

  return (
    <div className="login-indicator-box">
      {!session && (
        <Link to="/account/login" className="login-indicator-icon-link">
          <img src={loginIcon} alt="Login" className="login-indicator-icon" />
        </Link>
      )}
      {session && (
        <Link to="/account/profile" className="login-indicator-icon-link">
          <img
            src={ingelogdIcon}
            alt="Logged in"
            className="login-indicator-icon"
          />
        </Link>
      )}
    </div>
  );
};

export default LoginIndicator;
