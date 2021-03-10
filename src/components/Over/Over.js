import {
    Link, useRouteMatch
} from "react-router-dom";
import Title from "../Shared/PageTitle";

function Over() {
    let match = useRouteMatch();

    return(
        <div>
            <Title title="Over" />
            <Link to={`${match.url}/merchandise`} >Merchandise</Link>
        </div>
        

    )
}

export default Over;