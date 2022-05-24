import React, {useReducer, Reducer, useState} from "react";
import {back_post} from "../../../functions/api";

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
        <>
            {show && <form onSubmit={handleSubmit}>
                <div>
                    <label>Voornaam</label>
                    <input type="text" name="firstname" value={state.firstname}
                           onChange={handleFormChange}/>
                    <br />
                    <label>Achternaam</label>
                    <input type="text" name="lastname" value={state.lastname}
                           onChange={handleFormChange}/>
                    <br />
                    <label>Telefoon</label>
                    <input type="text" name="phone" value={state.phone}
                           onChange={handleFormChange} />
                    <br />
                    <label>E-mail</label>
                    <input type="text" name="email" value={state.email}
                           onChange={handleFormChange}/>
                </div>
                <button id="submit_button" type="submit">Schrijf je in via AV`40</button><br />
            </form>}
            {!show && <button className="meetrainen_4" onClick={handleSignup}>Schrijf je in!</button>}
        </>
    )
}

export default SchrijfIn;