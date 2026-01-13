import { useState } from "react";
import { useLocation, Link } from "react-router";
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
        {props.items.map(
          (item) =>
            !item.protected && (
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
