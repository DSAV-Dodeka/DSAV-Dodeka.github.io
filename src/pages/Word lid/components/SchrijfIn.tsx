import React, {useReducer, Reducer, useState} from "react";
import {back_post} from "../../../functions/api";
import "./SchrijfIn.scss";

const redirectUrl = "https://www.av40.nl/index.php?page=Inschrijfformulier&sid=1"

const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
    switch (action.type) {
        case 'change':
            return {
                ...state,
                [action.field]: action.value
            }
        default:
            throw new Error()
    }

}

type RegisterState = {
    firstname: string,
    lastname: string
    phone: string,
    email: string
}

type RegisterAction =
    | { type: 'reset'}
    | { type: 'change', field: string, value: string }

const initialState: RegisterState = {
    firstname: "",
    lastname: "",
    phone: "",
    email: ""
}

const SchrijfIn = () => {
    const [show, setShow] = useState(false)
    const [state, dispatch] = useReducer<Reducer<RegisterState, RegisterAction>, RegisterState>(
        registerReducer,
        initialState,
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        if (show) {
            back_post('onboard/signup', state).then()
            setShow(false)
            window.location.assign(redirectUrl)
        }

    }

    const handleFormChange = (event) => {
        const { name, value } = event.target
        dispatch({type: 'change', field: name, value})
    }

    const handleSignup = () => {
        setShow(true)
    }

    return (
        <div className="schrijfInDiv">
            {show && <form onSubmit={handleSubmit}>
                <div className="inputDiv">
                    <input type="text" name="firstname" placeholder="Voornaam" value={state.firstname}
                           onChange={handleFormChange}/>
                    <input type="text" name="lastname" placeholder="Achternaam" value={state.lastname}
                           onChange={handleFormChange}/>
                    <input type="text" name="phone" placeholder="Telefoonnummer" value={state.phone}
                           onChange={handleFormChange} />
                    <input type="text" name="email" placeholder="E-mail" value={state.email}
                           onChange={handleFormChange}/>
                </div>
                <button className="schrijfInButton" id="submit_button" type="submit">Schrijf je in via AV`40</button><br />
            </form>}
            {!show && <button className="schrijfInButton" onClick={handleSignup}>Schrijf je in!</button>}
        </div>
    )
}

export default SchrijfIn;