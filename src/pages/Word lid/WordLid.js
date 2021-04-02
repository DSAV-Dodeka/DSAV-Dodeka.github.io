import React from "react";
import PageTitle from "../../components/PageTitle";
import Meetrainen from "./components/meetrainen";
import Contributie from "./components/contributie";

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