import {
  useLocation, Link
} from "react-router";
import "./Item.scss"

function Item(props: { name: string; path: string; onClick?: () => void }) {
  const location = useLocation().pathname;

  return (
    <div id="navItem" onClick={props.onClick}>
      <Link to={props.path} className={"itemNav" + (props.path in ["/vereniging", "/contact"] ? (location.includes(props.path) ? " navItemActive" : " navItemNormal") : (location === props.path ? " navItemActive" : " navItemNormal"))}>{props.name}</Link>
    </div>
  )
}

export default Item;