import { Link } from "@tanstack/react-router";
import { useSessionInfo } from "$functions/query.ts";
import loginIcon from "$images/login/login.png";
import ingelogdIcon from "$images/login/ingelogd.png";
import "./LoginIndicator.css";

const LoginIndicator = () => {
  const { data: session, isLoading, isError } = useSessionInfo();

  // Keep prerender/hydration stable and avoid showing a broken login link when
  // the backend is unavailable.
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
