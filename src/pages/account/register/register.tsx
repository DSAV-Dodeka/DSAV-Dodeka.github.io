import {
  useReducer,
  FormEvent,
  ChangeEvent,
  // FocusEvent,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  type RegisterState,
  clientRegister,
  VoltaError,
  isVoltaEnabled,
  setVoltaEnabled,
  isVoltaToggleable,
} from "./register.ts";
import "./register.css";
import PageTitle from "$components/PageTitle.tsx";

const registerReducer = (
  state: RegisterState,
  action: RegisterAction,
): RegisterState => {
  switch (action.type) {
    case "reload":
      return action.new_state;
    case "change": // Both 'change' and 'change_bool' have same effect
    case "change_bool":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      throw new Error();
  }
};

type RegisterAction =
  | { type: "reload"; new_state: RegisterState }
  | { type: "change"; field: string; value: string }
  | { type: "change_bool"; field: string; value: boolean };

// Test data for dev mode (prefilled form for easier testing)
const testInitialState: RegisterState = {
  firstname: "Test",
  nameinfix: "van",
  lastname: "Tester",
  initials: "T.T.",
  email: "test@test.nl",
  phone: "0612345678",
  zipcode: "2611 AA",
  city: "Delft",
  address: "Teststraat",
  house_number: "42",
  date_of_birth: "2000-01-15",
  enable_incasso: true,
  iban: "NL18RABO0123459876",
  iban_name: "Test van Tester",
  gender: "0",
  birthday_check: false,
  photos: "ev-1-1",
  plan: "Wedstrijdlid",
  student: "ev-2-1",
  language: "nl-NL",
};

const emptyInitialState: RegisterState = {
  firstname: "",
  nameinfix: "",
  lastname: "",
  initials: "",
  email: "",
  phone: "",
  zipcode: "",
  city: "",
  address: "",
  house_number: "",
  date_of_birth: "",
  enable_incasso: false,
  iban: "",
  iban_name: "",
  gender: "0",
  birthday_check: false,
  photos: "ev-1-1",
  plan: "Wedstrijdlid",
  student: "ev-2-1",
  language: "nl-NL",
};

// Use test data in dev mode, empty form in production
const initialState: RegisterState = import.meta.env.DEV
  ? testInitialState
  : emptyInitialState;

// let focus: boolean = false;

// const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
//   if (!focus) {
//     event.target.blur();
//     event.target.type = "date";
//     focus = true;
//     clearTimeout(0);
//     event.target.focus();
//   }
// };

// const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
//   if (focus) {
//     event.target.type = "text";
//     focus = false;
//   }
// };

export default function Registreer() {
  const myStatus = useRef<HTMLDivElement>(null);
  const [handled, setHandled] = useState(false);
  const [infoOk, setInfoOk] = useState(false);
  const [state, dispatch] = useReducer(registerReducer, initialState);
  const [submitted, setSubmitted] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [voltaToggle, setVoltaToggle] = useState(isVoltaEnabled());

  const handleVoltaToggle = () => {
    const newValue = !voltaToggle;
    setVoltaToggle(newValue);
    setVoltaEnabled(newValue);
  };

  useEffect(() => {
    if (!handled) {
      try {
        const reducerInitial = { ...initialState };
        setInfoOk(true);
        dispatch({ type: "reload", new_state: reducerInitial });
      } catch (e) {
        setInfoOk(false);
      }
      setHandled(true);
    }
  }, [handled]);

  const somethingWrong = () => {
    setStatus(
      "Er is iets misgegaan, controleer je gegevens, probeer het opnieuw. Werkt het nog steeds niet? Neem contact op met het bestuur via bestuur@dsavdodeka.nl of via onze sociale media accounts.",
    );
  };

  const formIsValid = () => {
    setStatus("");
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formIsValid()) {
      const submitState = { ...state };
      setLoading(true);

      clientRegister(submitState).then(
        (registrationToken) => {
          setLoading(false);
          if (registrationToken) {
            window.location.assign(
              `/account/signup?token=${encodeURIComponent(registrationToken)}`,
            );
          } else {
            // In production, Volta succeeded but backend failed - still redirect
            // but without a token (user will need to contact admin)
            window.location.assign("/account/signup");
          }
        },
        (e) => {
          setLoading(false);
          console.log(e);

          if (e instanceof VoltaError) {
            setStatus(e.voltaMessage);
          } else {
            somethingWrong();
          }

          if (myStatus.current !== null) {
            myStatus.current.scrollIntoView();
          }
        },
      );
    }
  };

  const handleSubmitClick = () => {
    setSubmitted("submitted");
  };

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch({ type: "change", field: name, value });
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    dispatch({ type: "change", field: name, value });
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    dispatch({ type: "change_bool", field: name, value: checked });
  };

  return (
    <div>
      <PageTitle title="Registreer" />
      <div className="registreerContainer">
        {!infoOk && handled && (
          <p className="largeText">
            Deze link voor het registratieformulier werkt niet, probeer het
            opnieuw of vraag het bestuur om een nieuwe link!
          </p>
        )}
        {infoOk && (
          <form className="form" onSubmit={handleSubmit}>
            {isVoltaToggleable() && (
              <div className="volta-toggle">
                <label className="volta-toggle-label">
                  <input
                    type="checkbox"
                    checked={voltaToggle}
                    onChange={handleVoltaToggle}
                  />
                  <span>Volta inschrijving inschakelen</span>
                </label>
                <small className="volta-toggle-hint">
                  {voltaToggle
                    ? "Registratie wordt ook naar Volta verzonden"
                    : "Demo modus: alleen backend registratie"}
                </small>
              </div>
            )}
            <div className={"dropdown"}>
              <label>Taal/Language:</label>
              <select
                id="language"
                name="language"
                value={state.language}
                onChange={handleSelectChange}
              >
                <option value="nl-NL">Nederlands</option>
                <option value="en-GB">English/Other</option>
              </select>
            </div>
            <input
              className={submitted}
              required
              id="firstname"
              type="text"
              placeholder="Voornaam"
              name="firstname"
              value={state.firstname}
              onChange={handleFormChange}
            />
            <input
              className={submitted}
              id="nameinfix"
              type="text"
              placeholder="Tussenvoegsel"
              name="nameinfix"
              value={state.nameinfix}
              onChange={handleFormChange}
            />
            <input
              className={submitted}
              required
              id="lastname"
              type="text"
              placeholder="Achternaam"
              name="lastname"
              value={state.lastname}
              onChange={handleFormChange}
            />
            <input
              className={submitted}
              required
              id="initials"
              type="text"
              placeholder="Initialen"
              name="initials"
              value={state.initials}
              onChange={handleFormChange}
            />
            <div className={"dropdown"}>
              <label>Geslacht:</label>
              <select
                id="gender"
                name="gender"
                value={state.gender}
                onChange={handleSelectChange}
              >
                <option value="0">Man</option>
                <option value="1">Vrouw</option>
                <option value="2">Anders</option>
              </select>
            </div>
            <input
              className={submitted}
              required
              id="email"
              type="text"
              placeholder="E-mail"
              name="email"
              value={state.email}
              onChange={handleFormChange}
            />
            <input
              className={submitted}
              required
              id="phone"
              type="text"
              placeholder="Telefoonnummer"
              name="phone"
              value={state.phone}
              onChange={handleFormChange}
            />
            <div className="dropdown">
              <input
                className={submitted}
                required
                id="zipcode"
                type="text"
                placeholder="Postcode"
                name="zipcode"
                value={state.zipcode}
                onChange={handleFormChange}
              />
              <input
                className={submitted}
                required
                id="city"
                type="text"
                placeholder="Plaats"
                name="city"
                value={state.city}
                onChange={handleFormChange}
              />
              <input
                className={submitted}
                required
                id="address"
                type="text"
                placeholder="Straat"
                name="address"
                value={state.address}
                onChange={handleFormChange}
              />
              <input
                className={submitted}
                required
                id="house_number"
                type="text"
                placeholder="Huisnummer"
                name="house_number"
                value={state.house_number}
                onChange={handleFormChange}
              />
              <label>Geboortedatum:</label>
              <input
                className={submitted}
                required
                id="date_of_birth"
                type="date"
                placeholder="Geboortedatum"
                name="date_of_birth"
                value={state.date_of_birth}
                onChange={handleFormChange}
              />
            </div>
            <div className={"dropdown"}>
              <label>Soort lidmaatschap:</label>
              <select
                id="plan"
                name="plan"
                value={state.plan}
                onChange={handleSelectChange}
              >
                <option value="Wedstrijdlid">
                  Wedstrijdlid (€53,50 per kwartaal)
                </option>
                <option value="Recreantlid">
                  Recreantlid (€47,00 per kwartaal)
                </option>
                <option value="Gastlid">Gastlid (€44,00 per kwartaal)</option>
              </select>
            </div>
            <div className="checkbox">
              <label>
                Automatische incasso en akkoord €5 registratiekosten
              </label>
              <input
                required
                id="enable_incasso"
                type="checkbox"
                name="enable_incasso"
                checked={state.enable_incasso}
                onChange={handleCheckboxChange}
              />
            </div>
            <p style={{ marginBottom: "0.7rem", lineHeight: "1rem", fontStyle: "italic", color: "#999" }}>For non-dutch banks: please also send your BIC number to <a href="mailto:bestuur@dsavdodeka.nl" style={{ color: "#999" }}>bestuur@dsavdodeka.nl</a></p>
            <input
              className={submitted}
              required
              id="iban"
              type="text"
              placeholder="IBAN"
              name="iban"
              value={state.iban}
              onChange={handleFormChange}
            />
            <input
              className={submitted}
              required
              id="iban_name"
              type="text"
              placeholder="Naam op rekening"
              name="iban_name"
              value={state.iban_name}
              onChange={handleFormChange}
            />
            <div className="checkbox">
              <label>Leden mogen mijn verjaardag en leeftijd zien</label>
              <input
                className={submitted}
                id="birthday_check"
                type="checkbox"
                name="birthday_check"
                checked={state.birthday_check}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className={"dropdown"}>
              <label>Ben je student?</label>
              <select
                id="student"
                name="student"
                value={state.student}
                onChange={handleSelectChange}
              >
                <option value="ev-2-1">Nee</option>
                <option value="ev-2-2">Ja, op een mbo</option>
                <option value="ev-2-3">Ja, op een hbo</option>
                <option value="ev-2-4">Ja, op een universiteit</option>
              </select>
            </div>
            <div className={"dropdown"}>
              <label>Toestemming foto's?</label>
              <select
                id="photos"
                name="photos"
                value={state.photos}
                onChange={handleSelectChange}
              >
                <option value="ev-1-1">Ja, mag op sociale media</option>
                <option value="ev-1-3">Eerst vragen</option>
                <option value="ev-1-4">Niet individueel, groepsfoto mag</option>
                <option value="ev-1-2">Nee</option>
              </select>
            </div>
            <br />
            <button
              className="registerButton"
              disabled={loading}
              id="submit_button"
              onClick={handleSubmitClick}
              type="submit"
            >
              <span>Registreer</span>
              <span className={"spinner" + (loading ? " spinning" : "")}></span>
            </button>
            <br />
            <p className="buttonText">
              Door op registeer te klikken ga je akkoord met het eerder genoemde{" "}
              <a
                href="https://dsavdodeka.nl/files/privacyverklaring_dodeka_jan23.pdf"
                target="_blank"
                rel="noreferrer"
                className="privacy_link"
              >
                privacybeleid
              </a>
            </p>
            <div ref={myStatus} id="status" className="formStatus">
              {status.length > 0 ? (
                <span>
                  <strong>Error:</strong> {status}
                </span>
              ) : (
                ""
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
