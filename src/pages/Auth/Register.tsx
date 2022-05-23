import React, {useReducer, Reducer} from "react";

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
    username: string,
    password: string,
    email: string
}

type RegisterAction =
    | { type: 'register' }
    | { type: 'reset'}
    | { type: 'change', field: string, value: string }

const initialState: RegisterState = {
    username: "",
    password: "",
    email: ""
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input id="username" type="text" placeholder="username" name="username" value={state.username}
                           onChange={handleFormChange}/>
                    <br />
                    <label>Password</label>
                    <input type="password" placeholder="password" name="password" value={state.password}
                           onChange={handleFormChange} />
                    <br />
                    <label>E-mail</label>
                    <input type="text" placeholder="e-mail" name="email" value={state.email}
                           onChange={handleFormChange}/>
                </div>
                <button id="submit_button" type="submit">Register</button><br />
            </form>
        </>
    )
}

export default Register;