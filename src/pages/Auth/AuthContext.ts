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
import {Logger} from "../../functions/logger";
import {PagesError} from "../../functions/error";

export const defaultAuthState: AuthState = {
    username: "",
    scope: "none",

    updated_at: -1,

    id: "",
    it: {} as IdToken,
    access: "",
    refresh: "",

    isAuthenticated: false,
    isLoaded: false,

    invalidState: false
}

export const newAuthState = () => {
    return {
        ...defaultAuthState,
        it: {} as IdToken
    }
}

export const newInvalidState = (refresh: string) => {
    return {
        ...defaultAuthState,
        refresh: refresh,
        invalidState: true
    }
}

export type AuthState = {
    username: string
    scope: string

    updated_at: number

    id: string
    it: IdToken
    access: string
    refresh: string // An AuthState should always have a refresh token

    isAuthenticated: boolean
    isLoaded: boolean

    invalidState: boolean
}

const idTokenEarlyRefresh = 60; // 1 minute early

/**
 * Loads access token, ID token and refresh token from local storage and validates them.
 * It sets invalidState to true and returns if any of them are empty, if there was a parsing failure or if the ID
 * token has expired.
 * If there were no problems, it sets the User and returns the valid AuthState. Note that the access token or
 * refresh token could still be expired, but this is only checked if they are used in a request.
 * If invalidState is true, the refresh token should be defined.
 * @returns Returns an updated AuthState or undefined if there is a guaranteed problem.
 */
const loadFromStorage = (): AuthState | undefined => {
    const newState = newAuthState()
    newState.access = localStorage.getItem("access") || ""
    newState.id = localStorage.getItem("id_payload") || ""
    newState.refresh = localStorage.getItem("refresh") || ""
    newState.scope = localStorage.getItem("scope") || ""

    if (!newState.refresh) {
        // Without refresh token, always logout
        return undefined
    }

    if (!newState.id || !newState.access || !newState.scope) {
        // In this case refresh does exist, so try to use refresh token to reload
        return newInvalidState(newState.refresh)
    }

    try {
        newState.it = parseIdToken(newState.id)
    } catch (e) {
        // Something wrong with ID Token, try to reload
        return newInvalidState(newState.refresh)
    }

    // Time in seconds since UNIX Epoch
    const utc_now = Math.floor(Date.now()/1000)

    newState.updated_at = newState.it.auth_time

    if (utc_now > newState.updated_at + config.max_login) {
        // In this case we are certain the refresh token is outdated, so also do new login
        return undefined
    }

    if (utc_now > newState.it.exp - idTokenEarlyRefresh) {
        // ID token expired, so do refresh
        Logger.debug("id expired")
        return newInvalidState(newState.refresh)
    }

    newState.username = newState.it.sub
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


export type AuthUse = {
    authState: AuthState,
    setAuthState: Dispatch<SetStateAction<AuthState>>
}

const AuthContext = createContext({} as AuthUse)

export const AuthProvider = AuthContext.Provider

export default AuthContext

const loadedAs = () => {
    const as = newAuthState()
    as.isLoaded = true
    return as
}

export const clearSave = (as: AuthState) => {
    clearStorage()
    saveStorage(as)
}

export const useAuth = async (signal: AbortSignal): Promise<AuthState> => {
    let as = loadFromStorage()

    if (as === undefined) {
        return loadedAs()
    } else if (as.invalidState) {
        try {
            as = await renewAuth(as.refresh, signal)
            // Successful renewal
        } catch (e) {
            Logger.debug(e)
            return loadedAs()
        }
    }

    as.isAuthenticated = true
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
        as = await renewAuth(as.refresh)
        as.isLoaded = true
    } catch (e) {
        Logger.warn(e)


        as = useLogout()
    }
    saveStorage(as)
    return as
}

export const renewAuth = async (refresh: string, signal?: AbortSignal) => {
    const {
        id_payload_raw, id_payload, access_token, refresh_token, scope
    } = await doTokenRefresh(refresh, signal)
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

const doTokenRefresh = async (refresh: string, signal?: AbortSignal) => {
    const token_request = {
        "client_id":  config.client_id,
        "grant_type": "refresh_token",
        "refresh_token":  refresh,
    }

    let res
    try {
        res = await back_post("oauth/token/", token_request, {signal})
    } catch (e) {
        const err = await catch_api(e)
        if (err.error === "invalid_grant") {
            throw new PagesError("invalid_grant", err.error_description, "token_refresh_invalid")
        } else {
            throw e
        }
    }

    return await handleTokenResponse(res)
}

