import React from "react";
import PageTitle from "../../components/PageTitle";
import Meetrainen from "./components/Meetrainen";
import Contributie from "./components/Contributie";
import Text from "../../content/WordLid.json";

function WordLid() {
    return(
        <div>
            <PageTitle title="Word lid!"/>
            <Meetrainen text={Text.proeftrainen.text} foto={Text.proeftrainen.foto}/>
            <Contributie text={Text.contributie.text} foto={Text.contributie.foto}/>
        </div>
    )
}

export default WordLid;