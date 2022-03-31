import {createContext, Dispatch, SetStateAction} from "react";
import {handleTokenResponse, parseIdToken} from "./functions/OAuth";
import config from "./config";
import {redirect_uri} from "./AuthRedirect";

class User {
    username = ""
    updated_at = 0
}

export class AuthState {
    isAuthenticated = false
    user = new User()
    isLoaded = false
    loginRequired = false

    clear() {
        this.isAuthenticated = false
        this.user = new User()
        this.loginRequired = false
    }
}

interface IAuth {
    authState: AuthState,
    setAuthState: Dispatch<SetStateAction<AuthState>>
}

const AuthContext = createContext({} as IAuth)

export const AuthProvider = AuthContext.Provider

export default AuthContext

// export const useAuth = async () => {
//     const sleep = () => new Promise(resolve => setTimeout(resolve, 6000))
//     let x = new AuthState()
//     x.isLoaded = false
//     await sleep()
//     return x
// }

export const useAuth = async (retry: boolean = false) : Promise<AuthState> => {
    let as = new AuthState()
    const id_payload = localStorage.getItem("id_payload")
    const at = localStorage.getItem("access")
    const refresh = localStorage.getItem("refresh")
    if (!id_payload || !at || !refresh) {
        as.isLoaded = true
        return as
    }
    let it
    try {
        it = parseIdToken(id_payload)
    } catch (e) {
        console.log(e)
        as.loginRequired = true
        as.isLoaded = true
        return as
    }

    const utc_now = Math.floor(Date.now()/1000)
    if (utc_now > it.exp - (60 * 60)) {

        if (!retry) {
            // Updates localStorage
            await refresh_tokens(refresh)
            return await useAuth(true)
        } else {
            // Some error must have occurred
            // TODO see what error
            as.loginRequired = true
            as.isLoaded = true
            return as
        }
    }
    let user = new User()
    user.username = it.sub
    user.updated_at = it.auth_time
    as.user = user
    as.isAuthenticated = true
    as.isLoaded = true
    return as
}

export async function refresh_tokens(refresh: string) {
    const token_request = {
        "client_id":  config.client_id,
        "grant_type": "refresh_token",
        "refresh_token":  refresh,
    }

    const res = await fetch(`${config.auth_location}/oauth/token/`, {
        method: 'POST', body: JSON.stringify(token_request),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const res_j = await res.json()
    return await handleTokenResponse(res_j)
}