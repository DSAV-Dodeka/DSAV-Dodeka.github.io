import "./PageTitle.scss";

function PageTitle(props: { title: string }) {
  return <h1 id="page">{props.title.toUpperCase()}</h1>;
}
export default PageTitle;
