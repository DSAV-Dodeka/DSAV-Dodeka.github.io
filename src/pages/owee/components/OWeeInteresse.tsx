import "./OWeeInteresse.scss";

/*
 * De knop naar het interesseformulier, direct onder de planning: daar is iemand
 * net door alle activiteiten gescrold en is de vraag "en hoe doe ik mee?" op
 * zijn sterkst.
 *
 * Nieuw formulier volgend jaar? Vervang de href hieronder. Gebruik bij Google
 * Formulieren de deel-link (Verzenden -> het linkje), die eindigt op /viewform.
 * De link uit de adresbalk terwijl je het formulier bewerkt eindigt op /edit en
 * werkt niet voor bezoekers.
 *
 * De tekst van de titel, het tussenzinnetje en het knoplabel staan hieronder
 * gewoon als tekst. Vormgeving: OWeeInteresse.scss.
 * Dit blok wordt op de pagina gezet in owee.tsx.
 */
function OWeeInteresse() {
    return (
        <div className="OWeeInteresse">
            <h2 className="OWeeInteresseTitel">Interesse gekregen?</h2>
            <p className="OWeeInteresseTekst">
                Super leuk! Vul het interesseformulier in, dan krijg je
                informatie over hoe je eventueel lid kan worden en over onze
                proeftrainingen!
            </p>
            <a
                className="OWeeInteresseKnop"
                href="https://docs.google.com/forms/d/e/1FAIpQLSc4xozvdVigejC7rAnqe9x41SFxnAe6YvS4cNgLsiTQOP8bDQ/viewform"
                target="_blank"
                rel="noreferrer"
            >
                Vul het interesseformulier in
                <svg
                    className="OWeeInteresseKnopPijl"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                </svg>
            </a>
        </div>
    );
}

export default OWeeInteresse;
