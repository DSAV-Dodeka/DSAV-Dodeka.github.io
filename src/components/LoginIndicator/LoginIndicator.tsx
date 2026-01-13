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

const LoginIndicatorClient = () => {
  const { data: session, isLoading } = useSessionInfo();

  if (isLoading) {
    return null; // Don't show anything while loading
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
