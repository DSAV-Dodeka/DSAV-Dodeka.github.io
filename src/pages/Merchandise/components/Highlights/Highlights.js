import React from "react";
import Title from "./Title";
import Gallery from "./Gallery";

function Highlights(props) {
    return(
        <div class="lg:flex pt-8 pb-8 mb-16 lg:mb-24 bg-blauw bg-opacity-90">
            <p class="w-full lg:w-1/2 text-white px-4 pb-4 lg:px-0 lg:pb-0 lg:mx-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dignissim egestas lorem, in posuere arcu consectetur a. Morbi consequat libero et libero convallis suscipit. Proin ac augue vitae ex convallis porta vel in risus. Quisque mi quam, convallis at semper id, accumsan a quam. Duis accumsan dui a consectetur posuere. Aliquam efficitur lacus ac nibh iaculis, ac pharetra ex laoreet. Duis laoreet, ex id vulputate accumsan, purus diam volutpat magna, eu vehicula ante dolor vitae diam. Pellentesque quis ligula vel purus vestibulum pulvinar. Suspendisse fermentum euismod mi, ut pellentesque odio porta quis. Suspendisse quis viverra felis, non elementum sem. Nam id leo nulla.

Quisque vitae purus nunc. Morbi viverra bibendum augue et condimentum. Ut tempor feugiat mi, eu vestibulum nibh cursus in. Aenean maximus felis id lacus elementum malesuada. Morbi id rutrum nunc, aliquet bibendum metus. Aenean dapibus consequat lorem nec malesuada. Integer varius sem eget ipsum aliquet, ac posuere ante blandit. Nulla at vulputate mauris. Aenean imperdiet metus ac felis posuere pellentesque. Duis tempor tempus urna, eget ornare libero.</p>

            <div class="w-full lg:w-1/2">
            <Title title="Highlights"/>
            <Gallery items={props.items}/>
            </div>
            
        </div>   
    )
}

export default Highlights;

