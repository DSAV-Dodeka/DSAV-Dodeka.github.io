import Maps from "../../../components/Maps";
import ContactButtons from "../../../components/ContactButtons";
import "./Trainingsinfo.scss";

function Trainingsinfo(props: { text: string }) {
    return(
        <div className="trainingsinfo_1">
            <div className="trainingsinfo_2">
                <p className= "trainingsinfo_3">
                    {props.text.split('\n').map((item: string, index: number) =>
                        <span key={"trainingenLine" + index}>
                            {item}
                            <br/>
                        </span>
                    )}  
                </p>
                <ContactButtons />
            </div>
            <div className="trainingsinfo_4">
                <Maps />    
            </div>
        </div>
    )
}
export default Trainingsinfo;