import "./Heading.scss"

function Heading(props: { title: string }) {
    return(
        <div id="contact_heading" >
            <h1 id="bar_title">{props.title.toUpperCase()}</h1>
            <div id="arrow_container">
            <svg id="bar_arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
            </div>
            
        </div>
    )
}

export default Heading;