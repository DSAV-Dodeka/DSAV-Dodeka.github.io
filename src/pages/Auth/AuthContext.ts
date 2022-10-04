import {createContext, Dispatch, SetStateAction} from "react";
import {
    IdToken,
    parseIdToken,
    TokenError,
    validateTokenResponse
} from "./functions/OAuth";
import config from "../../config";
import {redirect_uri} from "./AuthRedirect";
import {string} from "zod";
import {back_post, catch_api} from "../../functions/api";

export const defaultAuthState: AuthState = {
    username: "",
    scope: "none",

    updated_at: -1,

    id: "",
    it: {} as IdToken,
    access: "",
    refresh: "",

    isAuthenticated: false,
    loginRequired: false,
    isLoaded: false,

    invalidState: false,
}

export const newAuthState = () => {
    return {
        ...defaultAuthState
    }
}

export type AuthState = {
    username: string
    scope: string

    updated_at: number

    id: string
    it: IdToken
    access: string
    refresh: string

    isAuthenticated: boolean
    loginRequired: boolean
    isLoaded: boolean

    invalidState: boolean
}

/**
 * Loads access token, ID token and refresh token from local storage and validates them.
 * It sets invalidState to true and returns if any of them are empty, if there was a parsing failure or if the ID
 * token has expired.
 * If there were no problems, it sets the User and returns the valid AuthState. Note that the access token or
 * refresh token could still be expired, but this is only checked if they are used in a request.
 * If the auth time has been exceeded by the max login time, loginRequired will be set to true.
 * @returns Returns an updated AuthState
 */
const loadFromStorage = (): AuthState => {
    const newState = newAuthState()
    newState.access = localStorage.getItem("access") || ""
    newState.id = localStorage.getItem("id_payload") || ""
    newState.refresh = localStorage.getItem("refresh") || ""
    newState.scope = localStorage.getItem("scope") || ""

    if (!newState.id || !newState.access || !newState.refresh || !newState.scope) {
        newState.invalidState = true
        return newState
    }

    try {
        newState.it = parseIdToken(newState.id)
    } catch (e) {
        newState.invalidState = true
        return newState
    }

    // Time in seconds since UNIX Epoch
    const utc_now = Math.floor(Date.now()/1000)
    // If true, expiry date is more than 1h in the past
    if (utc_now > newState.it.exp - (60 * 60)) {
        newState.invalidState = true
        return newState
    }

    newState.username = newState.it.sub
    newState.updated_at = newState.it.auth_time

    if (utc_now > newState.updated_at + config.max_login) {
        newState.loginRequired = true
        return newState
    }

    newState.invalidState = false
    return newState
}

const loadFromRenewal = (id_payload_raw: string, id_payload: IdToken, access_token: string, refresh_token: string, scope: string): AuthState => {
    return {
        ...defaultAuthState,
        username: id_payload.sub,
        scope,
        updated_at: id_payload.auth_time,
        access: access_token,
        refresh: refresh_token,
        id: id_payload_raw,
        it: id_payload,
        isAuthenticated: true,
    }
}

const saveStorage = (as: AuthState) => {
    localStorage.setItem("id_payload", as.id)
    localStorage.setItem("access", as.access)
    localStorage.setItem("refresh", as.refresh)
    localStorage.setItem("scope", as.scope)
}

const clearStorage = () => {
    localStorage.removeItem("id_payload")
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("scope")
}


export interface IAuth {
    authState: AuthState,
    setAuthState: Dispatch<SetStateAction<AuthState>>
}

const AuthContext = createContext({} as IAuth)

export const AuthProvider = AuthContext.Provider

export default AuthContext

export const useAuth = async (): Promise<AuthState> => {
    let as = loadFromStorage()

    if (as.invalidState) {
        // If it is invalid but there is a refresh token, renewal is attempted
        if (as.refresh) {
            try {
                as = await renewAuth(as)
                // Successful renewal
                as.isAuthenticated = true
            } catch (e) {
                console.log(e)
                // Failed renewal, logout
                as = newAuthState()
                clearStorage()
            }
        } else {
            // Renewal not possible, logout
            as = newAuthState()
            clearStorage()
        }
    } else if (as.loginRequired) {
        as = newAuthState()
        clearStorage()
        // Logout
    } else {
        as.isAuthenticated = true
    }

    saveStorage(as)
    as.isLoaded = true
    return as
}

export const useLogin = (id_payload_raw: string, id_payload: IdToken, access_token: string, refresh_token: string, scope: string): AuthState => {
    const as = loadFromRenewal(id_payload_raw, id_payload, access_token, refresh_token, scope)
    saveStorage(as)
    as.isLoaded = true
    return as
}

export const useLogout = (): AuthState => {
    let as = newAuthState()
    clearStorage()
    saveStorage(as)
    as.isLoaded = true
    return as
}

export const useRenewal = async (as: AuthState): Promise<AuthState> => {
    try {
        as = await renewAuth(as)
        as.isLoaded = true
    } catch (e) {
        console.log(e)
        as = useLogout()
    }
    saveStorage(as)
    return as
}

export const renewAuth = async (as: AuthState) => {
    const {
        id_payload_raw, id_payload, access_token, refresh_token, scope
    } = await refresh_tokens(as.refresh)
    return loadFromRenewal(id_payload_raw, id_payload, access_token, refresh_token, scope);
}

export const handleTokenResponse = async (res: any, nonce_original?: string) => {
    try {
        return await validateTokenResponse(res, nonce_original)
    } catch (e) {
        if (e instanceof TokenError) {
            // TODO
            throw e
        } else {
            throw e
        }
    }
}

const refresh_tokens = async (refresh: string) => {
    const token_request = {
        "client_id":  config.client_id,
        "grant_type": "refresh_token",
        "refresh_token":  refresh,
    }

    let res
    try {
        res = await back_post("oauth/token/", token_request)
    } catch (e) {
        const err = await catch_api(e)
        if (err.error === "invalid_grant") {
            //TODO
            throw e
        } else {
            throw e
        }
    }

    return await handleTokenResponse(res)
}

