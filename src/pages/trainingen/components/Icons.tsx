import "./Icons.scss";
import icons from "$images/trainingen/icons.svg";

function Icons() {
    return(
        <div id="icons" className="icons_1" style={{ backgroundImage: `url(${icons})` }}>
            {/* //easter egg */}
            <span className="egg-emoji">🐥</span>
            <span className="egg-emoji">🥚</span>
            <span className="egg-emoji">🐣</span>
            {/* // */}
        </div>
        
    )
}
export default Icons;