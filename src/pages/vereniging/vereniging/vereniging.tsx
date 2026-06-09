import {
    Link
} from "react-router";
import PageTitle from "../../../components/PageTitle";
import "./vereniging.scss";
import over from "$images/over/over.webp";
import overBestuur from "$images/over/overBestuur.webp";
import overCommissies from "$images/over/overCommissies.webp";
import arnold from "$images/over/arnold.webp";
import overGezelligheid from "$images/over/overGezelligheid.webp";


function Vereniging() {

    return(
        <div className="vereniging_1">
            <PageTitle title="vereniging" />
            <div className="vereniging_2">
                <p className="vereniging_3">D.S.A.V. Dodeka is dé Delfste Studenten Atletiekvereniging! Er wordt drie keer per week een training aangeboden samen met genoeg borrels, activiteiten em reizen om de leuke dodekaëders te leren kennen.<br></br><br></br>
                    D.S.A.V. Dodeka is aangesloten bij de Nederlandse Studenten Atletiek Federatie ZeuS.

                    De atleten van Dodeka zijn niet bang voor wat competitie en gaan vaak in groepjes naar allerlei verschillende wedstrijden toe. De grootste opkomst is te vinden bij alle Nederlands Studenten Kampioenschappen (NSK) waar wij altijd aan meedoen.<br></br><br></br>

                    Wij zijn een jonge vereniging met zo'n 160 leden. Dat ledenaantal heeft ons niet tegengehouden met het opzetten van de velen commissies. Er zijn genoeg commissies waar jij een bijdrage kan leveren, en van kan leren. Er is bijvoorbeeld een commissie voor activiteiten, maar ook voor de website waar je nu op kijkt, ook zijn er commissies voor de borrels of voor de nieuwsbrief en nog meer!<br></br><br></br>

                   <b>Geschiedenis</b> <br></br>

                    Dodeka is op 25 februari 2019 begonnen onder de naam DSAV'40 als een commissie bij AV'40. Om een eerste stap te zetten richting volledige onafhankelijkheid hebben wij besloten om door te gaan als D.S.A.V. Dodeka in 2021. Sinds 2025 zijn wij een officiële eigen studentenatletiekvereniging</p>
                <img src={over} className="vereniging_4" alt=""/>
            </div>
            <div className="tijdlijn">
                <div className="timeline">
                    <div className="event">
                        <h3>28 november 2018</h3>
                        <p>Start van studentengroep van AV '40</p>
                    </div>
                    <div className="event">
                        <h3>25 februari 2019</h3>
                        <p>Oprichting DSAV '40 en eerste officiële training</p>
                    </div>
                    <div className="event">
                        <h3>9 oktober 2020</h3>
                        <p>DSAV '40 organiseert voor het eerst een biermijl</p>
                    </div>
                    <div className="event">
                        <h3>maart 2021</h3>
                        <p>Naamswijziging naar DSAV Dodeka als ondervereniging van AV '40</p>
                    </div>
                    <div className="event">
                        <h3>4 juni 2021</h3>
                        <p>Website dsavdodeka.nl gaat live</p>
                    </div>
                    <div className="event">
                        <h3>8 februari 2022</h3>
                        <p>DSAV Dodeka wint voor het eerst de prestigieuze ZeuS bokaal voor de beste Studenten Atletiek Vereniging</p>
                    </div>
                    <div className="event">
                        <h3>1 september 2023</h3>
                        <p>DSAV Dodeka viert het eerste lustrum</p>
                    </div>
                    <div className="event">
                        <h3>16 september 2023</h3>
                        <p>DSAV Dodeka wint voor het eerst het NSK Teams</p>
                    </div>
                    <div className="event">
                        <h3>23 september 2024</h3>
                        <p>Leden besluiten om als zelfstandige vereniging door te gaan</p>
                    </div>
                    <div className="event">
                        <h3>28 november 2024</h3>
                        <p>Leden keuren statuten goed waarmee oprichting formele vereniging DSAV Dodeka officieel een feit is</p>
                    </div>
                    <div className="event">
                        <h3>4 januari 2025</h3>
                        <p>DSAV Dodeka wordt als officiële eigen vereniging lid van de Atletiekunie</p>
                    </div>
                    <div className="event">
                        <h3>6 juli 2025</h3>
                        <p>DSAV Dodeka promoveert in debuutjaar gelijk naar 2e Divisie Competitie</p>
                    </div>
                    <div className="event">
                        <h3>10 januari 2026</h3>
                        <p>DSAV Dodeka wint voor het vijfde jaar op rij de ZeuS bokaal</p>
                    </div>
                    <div className="event">
                        <h3>9 mei 2026</h3>
                        <p>In samenwerking met DSAV Dodeka wint de TU Delft voor het eerst de Batavierenrace</p>
                    </div>
                </div>
            </div>
            <div className="vereniging_5">
                <Link className="vereniging_6" to='bestuur' >
                    <h1 className="vereniging_7">Bestuur</h1>
                    <img src={overBestuur} className="vereniging_8" alt=""/>
                </Link>
                <Link className="vereniging_6" to='commissies' >
                    <h1 className="vereniging_7">Commissies</h1>
                    <img src={overCommissies} className="vereniging_8" alt=""/>
                </Link>
                <Link className="vereniging_6" to='arnold' >
                    <h1 className="vereniging_7">Arnold</h1>
                    <img src={arnold} className="vereniging_8" alt=""/>
                </Link>
                <Link className="vereniging_6" to='gezelligheid' >
                    <h1 className="vereniging_7">Gezelligheid</h1>
                    <img src={overGezelligheid} className="vereniging_8" alt=""/>
                </Link>
            </div>
        </div>

    )
}

export default Vereniging;