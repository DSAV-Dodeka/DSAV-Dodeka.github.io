import React from "react";
import "./WedstrijdAlgemeen.scss";
import ContactButtons from "../../../components/ContactButtons";
import indoor from "../../../images/wedstrijden/nsk_indoor_algemeen.jpeg";

function Wedstrijd() {
    return(
        <div className="wedstrijd_algemeen">
            <img className="wedstrijd_algemeen_foto" alt="" src={indoor}/>
            <p class="wedstrijd_algemeen_info"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec varius quam. In vel metus fermentum massa convallis volutpat. Cras elementum lacinia eros, in vulputate ex ornare congue. Phasellus vulputate faucibus vestibulum. Vestibulum nec mauris et mauris venenatis rutrum. Aliquam erat volutpat. Phasellus non blandit ex, ut interdum lectus. Nullam a auctor eros. Ut aliquet ultrices nisi, et sodales ligula tincidunt vel. Fusce dapibus, ipsum vitae pulvinar aliquam, leo nulla suscipit ex, sed auctor arcu dolor a arcu. In fermentum ex id tortor eleifend, vel convallis mi elementum. Nunc porta magna non vehicula accumsan. Vestibulum quis magna nunc. Integer porttitor turpis vel congue scelerisque. Fusce malesuada turpis leo, sed malesuada leo semper nec. Integer quis lacus id lacus pellentesque mollis.

Curabitur dignissim, turpis ac gravida pulvinar, quam purus lacinia ex, non mattis justo neque ac odio. Fusce vel porta magna, sed sagittis sapien. Donec faucibus, lacus venenatis mattis luctus, orci justo vulputate felis, ut tincidunt lorem enim ac ante. Donec in malesuada tellus, ut sodales tellus. In turpis felis, eleifend vel sodales in, fermentum non orci. Phasellus quam tortor, ultrices nec posuere quis, mollis lobortis lorem. Aliquam eleifend rutrum tincidunt.</p>
            <ContactButtons />
        </div>
    )
}

export default Wedstrijd;