import React, {useReducer, Reducer, useState} from "react";
import "./Register.scss";
import PasswordStrengthBar from 'react-password-strength-bar';
import config from "../../config";

const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
    switch (action.type) {
        case 'change':
            return {
                ...state,
                [action.field]: action.value
            }
        case 'register':
            localStorage.setItem("register_password", state.password)
            const target_params = new URLSearchParams({
                "email": state.email,
                "register_id": state.register_id
            }).toString()

            window.location.assign(config.auth_location + "/credentials/register/?" + target_params)
            return state
        default:
            throw new Error()
    }

}

type RegisterState = {
    name: string,
    surname: string,
    email: string,
    phone: string,
    password: string,
    password_confirm: string,
    date_of_birth: string,
    birthday_check: boolean,
    student: boolean,
    onderwijsinstelling: string,
    register_id: string
}

type RegisterAction =
    | { type: 'register' }
    | { type: 'reset'}
    | { type: 'change', field: string, value: string }

const initialState: RegisterState = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    date_of_birth: "",
    birthday_check: false,
    student: false,
    onderwijsinstelling: "",
    register_id: ""
}

const Register = () => {
    const [state, dispatch] = useReducer<Reducer<RegisterState, RegisterAction>, RegisterState>(
        registerReducer,
        initialState,
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        const source_params = (new URLSearchParams(window.location.search))
        const registerId = source_params.get("register_id");
        dispatch({type: 'change', field: "register_id", value: registerId})
        dispatch({type: 'register'})
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target
        dispatch({type: 'change', field: name, value})
    }

    const handleCheckboxChange = (event) => {
        const {name, checked} = event.target
        if (checked) dispatch({type: 'change', field: name, value: true});
        else dispatch({type: 'change', field: name, value: false});
    }

    return (
        <>
            <form className="registerForm" onSubmit={handleSubmit}>
                <div className="formContents">
                    <input id="name" type="text" placeholder="Voornaam" name="name" value={state.name}
                           onChange={handleFormChange}/>
                    <input id="surname" type="text" placeholder="Achternaam" name="surname" value={state.surname}
                           onChange={handleFormChange}/>
                    <input id="email" type="text" placeholder="E-mail" name="email" value={state.email}
                           onChange={handleFormChange}/>
                    <input id="phone" type="text" placeholder="Telefoonnummer" name="phone" value={state.phone}
                           onChange={handleFormChange}/>
                    <input id="password" type="password" placeholder="Wachtwoord" name="password" value={state.password}
                           onChange={handleFormChange}/>
                    <PasswordStrengthBar password={state.password} />
                    <br/>
                    <input id="password_confirm" type="password" placeholder="Herhaal wachtwoord" name="password_confirm" value={state.password_confirm}
                           onChange={handleFormChange}/>
                    <input id="date_of_birth" type="date" name="date_of_birth" value={state.date_of_birth}
                            onChange={handleFormChange} />
                    <div className="checkbox">
                        <label >Leden mogen mijn verjaardag zien</label>
                        <input id="birthday_check" type="checkbox" name="birthday_check" value={state.birthday_check}
                                onChange={handleFormChange}/>
                    </div>
                    <div className="checkbox">
                        <label >Ik ben student</label>
                        <input id="student" type="checkbox" name="student"
                                onChange={handleCheckboxChange}/>
                    </div>
                    <div className={"dropdown" + (state.student ? "": " inputHidden")}>
                        <label >Onderwijsinstelling:</label>
                        <select id="onderwijsinstelling" name="onderwijsinstelling" value={state.onderwijsinstelling}
                                onChange={handleFormChange}>
                            <option value="TU Delft">TU Delft</option>
                            <option value="Haagse Hogeschool - Delft">Haagse Hogeschool - Delft</option>
                            <option>Haagse Hogeschool - Den Haag</option>
                            <option>Hogeschool Inholland - Delft</option>
                            <option value="Anders, namelijk:">Anders, namelijk:</option>
                        </select>
                    </div>
                    <input className={"" + (state.onderwijsinstelling === "Anders, namelijk:" ? "" : " inputHidden")} id="onderwijsinstelling_overig" type="text" placeholder="Onderwijsinstelling" name="onderwijsinstelling_overig" value={state.onderwijsinstelling_overig}
                            onChange={handleFormChange} />
                    <div className="checkbox">
                        <label >Ik accepteer het privacybeleid</label>
                        <input id="privacy" type="checkbox" name="privacy"
                                onChange={handleCheckboxChange}/>
                    </div>
                    
                </div>
                <button className="registerButton" id="submit_button" type="submit">Registreer</button><br />
            </form>
        </>
    )
}

export default Register;