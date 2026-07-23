import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { useSessionInfo } from "$functions/query.ts";
import "./Dropdown.scss";

interface DropdownProps {
  name: string;
  path: string;
  items: {
    name: string;
    path: string;
    protected?: boolean;
  }[];
}

function ProtectedItem({ to, name }: { to: string; name: string }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);
  if (!isClient) return null;
  return <ProtectedItemClient to={to} name={name} />;
}

function ProtectedItemClient({ to, name }: { to: string; name: string }) {
  const { data: session } = useSessionInfo();
  const isMember = session?.user.permissions.includes("member") ?? false;
  if (!isMember) return null;
  return (
    <Link to={to} className="dropdownElement">
      {name}
    </Link>
  );
}

function Dropdown(props: DropdownProps) {
  const location = useLocation().pathname;
  const [active, setActive] = useState(false);

  return (
    <div id="navDropdown" onMouseLeave={() => setActive(false)}>
      <Link
        to={props.path}
        onMouseEnter={() => setActive(true)}
        className={
          "dropdownNav " +
          (location.includes(props.path)
            ? "navDropdownActive"
            : "navDropdownNormal")
        }
      >
        {props.name}
      </Link>
      <div
        onClick={() => setActive(false)}
        className={active ? "drop" : "dropHide"}
      >
        {props.items.map((item) =>
          item.protected ? (
            <ProtectedItem
              key={"pcDrop" + item.name}
              to={props.path + item.path}
              name={item.name}
            />
          ) : (
            <Link
              key={"pcDrop" + item.name}
              to={props.path + item.path}
              className={"dropdownElement"}
            >
              {item.name}
            </Link>
          ),
        )}
      </div>
    </div>
  );
}

export default Dropdown;
