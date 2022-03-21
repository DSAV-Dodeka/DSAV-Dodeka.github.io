import { createContext } from "react";

class User {
    username = ""
    updated_at = 0
}

export class AuthState {
    isAuthenticated = false
    user = new User()
    isLoading = true
}

const initialAuthState = new AuthState()

const AuthContext = createContext("")

export const AuthProvider = AuthContext.Provider

export default AuthContext