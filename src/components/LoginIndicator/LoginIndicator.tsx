import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useSessionInfo } from "../../functions/query";
import { clearCurrentSession } from "../../functions/faroe-client";
import loginIcon from "$images/login/login.png";
import ingelogdIcon from "$images/login/ingelogd.png";
import "./LoginIndicator.css";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClick(ref: React.RefObject<HTMLElement>, callback: () => void) {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };
  useEffect(() => {
    // Bind the event listener
    document.addEventListener("click", handleClick);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClick);
    };
  });
}

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
  const queryClient = useQueryClient();
  const [active, setActive] = useState(false);
  const { data: session, isLoading } = useSessionInfo();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    setActive(false);
  });

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await clearCurrentSession();
      // Invalidate session query to update login indicator
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      // Navigate to home
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  return (
    <div className="login-indicator-box">
      {!session && (
        <button className="login-indicator-button" onClick={handleLogin}>
          <img src={loginIcon} alt="Login" className="login-indicator-icon" />
        </button>
      )}
      {session && (
        <div className="login-indicator-dropdown" onClick={() => setActive(!active)}>
          <div ref={ref} className="login-indicator-profile">
            <img src={ingelogdIcon} alt="Logged in" className="login-indicator-icon" />
          </div>
          <div className={active ? "login-indicator-drop" : "login-indicator-drop-hide"}>
            <div className="login-indicator-user-info">
              {session.user.firstname} {session.user.lastname}
            </div>
            <Link className="login-indicator-dropdown-element" to="/profile">
              Profile
            </Link>
            {session.user.permissions.includes("admin") && (
              <Link className="login-indicator-dropdown-element" to="/admin">
                Admin
              </Link>
            )}
            <button
              className="login-indicator-dropdown-element login-indicator-drop-last"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginIndicator;
