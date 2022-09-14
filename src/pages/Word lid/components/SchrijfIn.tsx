import React, {useReducer, ChangeEvent, useState, FormEvent} from "react";
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
        case 'reset':
            return {
                ...initialState
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
    const [status, setStatus] = useState("");
    const [state, dispatch] = useReducer(
        registerReducer,
        initialState,
    )

    const validateInput = () => {
        console.log(state.firstname)
        if (state.firstname === "") {
            setStatus("Vul je voornaam in")
            return false;
        }
        else if (state.lastname === "") {
            setStatus("Vul je achternaam in")
            return false;
        }
        else if (state.phone === "") {
            setStatus("Vul je telefoonnummer in")
            return false;
        }
        else if (state.email === "") {
            setStatus("Vul je emailadres in")
            return false;
        }
        else if (! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)){
            setStatus("Vul een correct emailadres in")
            return false;
        }
        return true;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (show && validateInput()) {
            back_post('onboard/signup', state).then()
            setShow(false)
            dispatch({type: 'reset'})
            setStatus("")
            window.location.assign(redirectUrl)
        }

    }

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
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
                    <p className="schrijfInStatus">{status}</p>
                </div>
                <button className="schrijfInButton" id="submit_button" type="submit">Schrijf je in via AV`40</button><br />
            </form>}
            {!show && <button className="schrijfInButton" onClick={handleSignup}>Schrijf je in!</button>}
        </div>
    )
}

export default SchrijfIn;