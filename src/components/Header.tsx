import "./Header.scss";

function Header(props: { text: string; position?: string }) {
    return(
        <div className="header">
            <h1 className={"headerText " + props.position}>
                {props.text.toUpperCase()}
            </h1>
        </div>
    )
}
export default Header;