import "./OWeeImageBar.scss";
import atletiek from "$images/owee/atletiek.webp";
import trackFestival from "$images/owee/track_festival.webp";
import marioKrat from "$images/owee/mario_krat.webp";
import training_kogel from "$images/owee/training_kogel.webp";


function OWeeText() {
    return(
        <div className="OWeeImageBar">
            <img className="OWeeImage" src={atletiek}/>
            <img className="OWeeImage" src={marioKrat}/>
            <img className="OWeeImage" src={training_kogel}/>
            
        </div>
    )
}

export default OWeeText;