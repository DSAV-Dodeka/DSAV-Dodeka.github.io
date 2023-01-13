import React from "react";
import PageTitle from "../../components/PageTitle";
import {Link} from "react-router-dom";

const Registered = () => {
    return (
        <>
            <PageTitle title="Registered" />
            <p>Welkom bij D.S.A.V. Dodeka! Je bent nu officieel geregistreerd! Klik <Link to="/lg">hier</Link> om in te loggen.</p>
        </>
    )
}

export default Registered;