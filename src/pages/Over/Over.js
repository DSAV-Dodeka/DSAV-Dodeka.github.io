import {
    Link, useRouteMatch
} from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import test from "../../images/placeholder.png"

function Over() {
    let match = useRouteMatch();

    return(
        <div>
            <PageTitle title="Over" />
            <div class="bg-blauw bg-opacity-90 w-full text-white p-16">
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim egestas lorem, in posuere arcu consectetur a. Morbi consequat libero et libero convallis suscipit. Proin ac augue vitae ex convallis porta vel in risus. Quisque mi quam, convallis at semper id, accumsan a quam. Duis accumsan dui a consectetur posuere. Aliquam efficitur lacus ac nibh iaculis, ac pharetra ex laoreet. Duis laoreet, ex id vulputate accumsan, purus diam volutpat magna, eu vehicula ante dolor vitae diam. Pellentesque quis ligula vel purus vestibulum pulvinar. Suspendisse fermentum euismod mi, ut pellentesque odio porta quis. Suspendisse quis viverra felis, non elementum sem. Nam id leo nulla.

Quisque vitae purus nunc. Morbi viverra bibendum augue et condimentum. Ut tempor feugiat mi, eu vestibulum nibh cursus in. Aenean maximus felis id lacus elementum malesuada. Morbi id rutrum nunc, aliquet bibendum metus. Aenean dapibus consequat lorem nec malesuada. Integer varius sem eget ipsum aliquet, ac posuere ante blandit. Nulla at vulputate mauris. Aenean imperdiet metus ac felis posuere pellentesque. Duis tempor tempus urna, eget ornare libero.

Donec sit amet urna luctus dui scelerisque consequat. Vivamus sit amet fermentum lorem. Morbi tempor tellus sit amet facilisis feugiat. Pellentesque luctus nulla at imperdiet interdum. Quisque semper enim a sem ultricies, a congue lacus euismod. Donec vitae ipsum nec ipsum suscipit vulputate sed ac tellus. Aenean condimentum lectus vitae aliquam fermentum. Donec dignissim venenatis lorem et commodo. Aenean ornare, leo ut ornare faucibus, turpis elit vulputate tortor, eget blandit risus nisi a velit. Curabitur urna dui, finibus ut aliquam sed, facilisis sit amet nisl. Aliquam eget lectus sapien. Aliquam egestas, ipsum eget posuere maximus, ex quam suscipit tellus, ut varius ex libero mollis ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus fermentum auctor odio, sed vestibulum augue consectetur a. </p>
            </div>
            <div class="flex">
            <Link class="relative w-1/3 h-128" to={`${match.url}/bestuur`} >
                    <img src={test} class="h-96 w-96 bg-blauw m-auto mt-16"/>
                    <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-24 right-0">Bestuur</h1>
                </Link>
                <Link class="relative w-1/3 h-128" to={`${match.url}/commissies`} >
                    <img src={test} class="h-96 w-96 bg-blauw m-auto mt-16"/>
                    <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-24 right-0">Commissies</h1>
                </Link>
                <Link class="relative w-1/3 h-128" to={`${match.url}/merchandise`} >
                    <img src={test} class="h-96 w-96 bg-blauw m-auto mt-16"/>
                    <h1 class="absolute bg-rood py-2 px-8 w-96 text-white text-3xl font-bold top-24 right-0">Merchandise</h1>
                </Link>
            </div>
        </div>
        

    )
}

export default Over;