import {
    Link, useRouteMatch
} from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import test from "../../images/placeholder.png"

function Over() {
    let match = useRouteMatch();

    return(
        <div class="overflow-x-hidden">
            <PageTitle title="Over" />
            <div class="lg:flex bg-blauw bg-opacity-90 w-full text-white">
                <p class="w-full lg:w-1/2 p-4 lg:p-16"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim egestas lorem, in posuere arcu consectetur a. Morbi consequat libero et libero convallis suscipit. Proin ac augue vitae ex convallis porta vel in risus. Quisque mi quam, convallis at semper id, accumsan a quam. Duis accumsan dui a consectetur posuere. Aliquam efficitur lacus ac nibh iaculis, ac pharetra ex laoreet. Duis laoreet, ex id vulputate accumsan, purus diam volutpat magna, eu vehicula ante dolor vitae diam. Pellentesque quis ligula vel purus vestibulum pulvinar. Suspendisse fermentum euismod mi, ut pellentesque odio porta quis. Suspendisse quis viverra felis, non elementum sem. Nam id leo nulla.

Quisque vitae purus nunc. Morbi viverra bibendum augue et condimentum. Ut tempor feugiat mi, eu vestibulum nibh cursus in. Aenean maximus felis id lacus elementum malesuada. Morbi id rutrum nunc, aliquet bibendum metus. Aenean dapibus consequat lorem nec malesuada. Integer varius sem eget ipsum aliquet, ac posuere ante blandit. Nulla at vulputate mauris. Aenean imperdiet metus ac felis posuere pellentesque. Duis tempor tempus urna, eget ornare libero.</p>
                <img src={test} class="w-full lg:w-1/2" alt=""/>
            </div>
            <div class="lg:flex mb-16">
            <Link class="relative w-full lg:w-1/3 lg:h-128" to={`${match.url}/bestuur`} >
                    <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-8 ml-8 z-30 lg:ml-0 left-0 lg:top-32 lg:right-0">Bestuur</h1>
                    <img src={test} class="h-96 w-96 bg-blauw m-auto mt-16 lg:mt-24" alt=""/>
                </Link>
                <Link class="relative w-full lg:w-1/3 h-128 overflow-x-hidden" to={`${match.url}/commissies`} >
                <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-24 z-30 ml-8 lg:ml-0 left-0 lg:top-32 lg:right-0">Commissies</h1>
                    <img src={test} class="h-96 w-96 bg-blauw m-auto mt-16 lg:mt-24" alt=""/>
                    
                </Link>
                <Link class="relative w-full lg:w-1/3 h-128 overflow-x-hidden" to={`${match.url}/merchandise`} >
                <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-24 z-30 ml-8 lg:ml-0 left-0 lg:top-32 lg:right-0">Merchandise</h1>
                    <img src={test} class="h-96 w-96 bg-blauw m-auto mt-16 lg:mt-24" alt=""/>
                </Link>
            </div>
        </div>
        

    )
}

export default Over;