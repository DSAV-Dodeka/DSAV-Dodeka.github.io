import "./WedstrijdMaps.scss"

function Maps(props: { locatie: string }) {
    return(
        <iframe id="wedstrijd_locatie" title="Baan" loading="lazy" referrerPolicy="no-referrer" src={props.locatie} />
    )
}


export default Maps;
