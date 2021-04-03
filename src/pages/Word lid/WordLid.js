import React from "react";
import PageTitle from "../../components/PageTitle";
import Meetrainen from "./components/Meetrainen";
import Contributie from "./components/Contributie";

function WordLid() {
    return(
        <div>
            <PageTitle title="Word Lid"/>
            <Meetrainen />
            <Contributie />
        </div>
    )
}

export default WordLid;