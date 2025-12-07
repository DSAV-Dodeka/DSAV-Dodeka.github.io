import PageTitle from "../../components/PageTitle";
import Meetrainen from "./components/Meetrainen";
// import Contributie from "./components/Contributie";

function WordLid() {
  return (
    <div>
      <PageTitle title="Word lid!" />
      <Meetrainen />
      {/* <Contributie text={Text.contributie.text} foto={Text.contributie.foto}/> */}
    </div>
  );
}

export default WordLid;
