import React, {useReducer, Reducer} from "react";
import "./Register.scss";
import PasswordStrengthBar from 'react-password-strength-bar';

const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
    switch (action.type) {
        case 'change':
            return {
                ...state,
                [action.field]: action.value
            }
        case 'register':
            console.log(state.email)
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
}

const Register = () => {

    const [state, dispatch] = useReducer<Reducer<RegisterState, RegisterAction>, RegisterState>(
        registerReducer,
        initialState,
    )

    const handleSubmit = (e) => {
        e.preventDefault()

        dispatch({type: 'register'})
    }

    const handleFormChange = (event) => {
        const { name, value } = event.target
        dispatch({type: 'change', field: name, value})
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
                </div>
                <button className="registerButton" id="submit_button" type="submit">Registreer</button><br />
            </form>
        </>
    )
}

export default Register;