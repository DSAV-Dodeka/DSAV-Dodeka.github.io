import {
    Link
} from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import "./Vereniging.scss";
import getUrl from "../../../functions/links";


function Vereniging() {

    return(
        <div className="vereniging_1">
            <PageTitle title="vereniging" />
            <div className="vereniging_2">
                <p className="vereniging_3">D.S.A.V. Dodeka is dé Delfste Studenten AtletiekVereniging! Er wordt drie keer per week een training aangeboden samen met genoeg borrels en activiteiten om de leuke dodekaëders te leren kennen.<br></br><br></br>
                    D.S.A.V. Dodeka is aangesloten bij de Nederlandse Studenten Atletiek Federatie ZeuS.

                    De atleten van Dodeka zijn niet bang voor wat competitie en gaan vaak in groepjes naar allerlei verschillende wedstrijden toe. De grootste opkomst is te vinden bij alle Nederlands Studenten Kampioenschappen (NSK) waar wij altijd aan meedoen.<br></br><br></br>

                    Wij zijn een jonge vereniging met zo'n 80 leden. Dat ledenaantal heeft ons niet tegengehouden met het opzetten van de velen commissies. Er zijn genoeg commissies waar jij een bijdrage kan leveren, en van kan leren. Er is bijvoorbeeld een commissie voor activiteiten, maar ook voor de website waar je nu op kijkt, ook zijn er commissies voor de borrels of voor de nieuwsbrief en nog meer!<br></br><br></br>

                   <b>Geschiedenis</b> <br></br>

                    Dodeka is op 25 februari 2019 begonnen onder de naam DSAV`40 als een commissie bij AV`40. Om een eerste stap te zetten richting volledige onafhankelijkheid hebben wij besloten om door te gaan als D.S.A.V. Dodeka in 2021.</p>
                <img src={getUrl(`over/over.jpg`)} className="vereniging_4" alt=""/>
            </div>
            <div className="vereniging_5">
                <Link className="vereniging_6" to='bestuur' >
                    <h1 className="vereniging_7">Bestuur</h1>
                    <img src={getUrl(`over/overBestuur.jpg`)} className="vereniging_8" alt=""/>
                </Link>
                <Link className="vereniging_6" to='commissies' >
                    <h1 className="vereniging_7">Commissies</h1>
                    <img src={getUrl(`over/overCommissies.jpg`)} className="vereniging_8" alt=""/>
                </Link>
                <Link className="vereniging_6" to='arnold' >
                    <h1 className="vereniging_7">Arnold</h1>
                    <img src={getUrl(`over/arnold.jpg`)} className="vereniging_8" alt=""/>
                </Link>
                <Link className="vereniging_6" to='gezelligheid' >
                    <h1 className="vereniging_7">Gezelligheid</h1>
                    <img src={getUrl(`over/overGezelligheid.jpg`)} className="vereniging_8" alt=""/>
                </Link>
            </div>
        </div>

    )
}

export default Vereniging;