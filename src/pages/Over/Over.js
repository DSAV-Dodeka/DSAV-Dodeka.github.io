import {
    Link, useRouteMatch
} from "react-router-dom";
import PageTitle from "../../components/PageTitle";
// import test from "../../images/over/placeholder.png"
import over from "../../images/over/over.jpg"
import bestuur from "../../images/over/overBestuur.jpg"
import commissie from "../../images/over/overCommissies.jpg"
import merch from "../../images/over/overMerch.jpg"


function Over() {
    let match = useRouteMatch();

    return(
        <div class="overflow-x-hidden">
            <PageTitle title="Over" />
            <div class="lg:flex bg-blauw bg-opacity-90 w-full text-white">
                <p class="w-full lg:w-1/2 p-4 lg:p-16">D.S.A.V. Dodeka is dé Delfste Studenten AtletiekVereniging! Er wordt drie keer per week een training aangeboden samen met genoeg borrels en activiteiten om de leuke dodekaëders te leren kennen.<br></br><br></br>
                    D.S.A.V. Dodeka is aangesloten bij de Nederlandse Studenten Atletiek Federatie ZeuS.

                    De atleten van Dodeka zijn niet bang voor wat competitie en gaan vaak in groepjes naar allerlei verschillende wedstrijden toe. De grootste opkomst is te vinden bij alle Nederlands Studenten Kampioenschappen (NSK) waar wij altijd aan meedoen.<br></br><br></br>

                    Wij zijn een jonge vereniging met zo'n 80 leden. Dat ledenaantal heeft ons niet tegengehouden met het opzetten van de velen commissies. Er zijn genoeg commissies waar jij een bijdrage kan leveren, en van kan leren. Er is bijvoorbeeld een commissie voor activiteiten, maar ook voor de website waar je nu op kijkt, ook zijn er commissies voor de borrels of voor de nieuwsbrief en nog meer!<br></br><br></br>

                   <b>Geschiedenis</b> <br></br>

                    Dodeka is op 25 februari 2019 begonnen als DSAV`40 als een commissie bij AV`40 in 2019. Om een eerste stap te zetten richting volledige onafhankelijkheid hebben wij besloten om door te gaan als D.S.A.V. Dodeka in 2021.</p>
                <img src={over} class="w-full lg:w-1/2 object-cover" alt=""/>
            </div>
            <div class="lg:flex mb-16">
            <Link class="relative w-full lg:w-1/3 lg:h-128" to={`${match.url}/bestuur`} >
                    <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-8 ml-8 z-30 lg:ml-0 left-0 lg:top-32 lg:right-0">Bestuur</h1>
                    <img src={bestuur} class="object-cover h-96 w-96 bg-blauw m-auto mt-16 lg:mt-24" alt=""/>
                </Link>
                <Link class="relative w-full lg:w-1/3 h-128 overflow-x-hidden" to={`${match.url}/commissies`} >
                <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-24 z-30 ml-8 lg:ml-0 left-0 lg:top-32 lg:right-0">Commissies</h1>
                    <img src={commissie} class="object-cover h-96 w-96 bg-blauw m-auto mt-16 lg:mt-24" alt=""/>
                    
                </Link>
                <Link class="relative w-full lg:w-1/3 h-128 overflow-x-hidden" to={`${match.url}/merchandise`} >
                <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-24 z-30 ml-8 lg:ml-0 left-0 lg:top-32 lg:right-0">Merchandise</h1>
                    <img src={merch} class="object-cover h-96 w-96 bg-blauw m-auto mt-16 lg:mt-24" alt=""/>
                </Link>
            </div>
        </div>
        

    )
}

export default Over;