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

export class AuthState {
    username: string = ""
    scope: string = "none"

    updated_at: number = -1

    id: string = ""
    it: IdToken | null = null
    access: string = ""
    refresh: string = ""

    isAuthenticated = false
    loginRequired = false
    isLoaded = false

    invalidState = false

    /**
     * Loads access token, ID token and refresh token from local storage and validates them.
     * It sets invalidState to true and returns if any of them are empty, if there was a parsing failure or if the ID
     * token has expired.
     * If there were no problems, it sets the User and returns the valid AuthState. Note that the access token or
     * refresh token could still be expired, but this is only checked if they are used in a request.
     * If the auth time has been exceeded by the max login time, loginRequired will be set to true.
     * @returns Returns an updated AuthState
     */
    loadFromStorage(): AuthState {
        this.access = localStorage.getItem("access") || ""
        this.id = localStorage.getItem("id_payload") || ""
        this.refresh = localStorage.getItem("refresh") || ""

        if (!this.id || !this.access || !this.refresh) {
            this.invalidState = true
            return this
        }

        try {
            this.it = parseIdToken(this.id)
        } catch (e) {
            this.invalidState = true
            return this
        }

        // Time in seconds since UNIX Epoch
        const utc_now = Math.floor(Date.now()/1000)
        // If true, expiry date is more than 1h in the past
        if (utc_now > this.it.exp - (60 * 60)) {
            this.invalidState = true
            return this
        }

        this.username = this.it.sub
        this.updated_at = this.it.auth_time

        if (utc_now > this.updated_at + config.max_login) {
            this.loginRequired = true
            return this
        }

        this.invalidState = false
        return this
    }

    loadFromRenewal(id_payload_raw: string, id_payload: IdToken, access_token: string, refresh_token: string, scope: string): AuthState {
        this.username = id_payload.sub
        this.scope = scope

        this.updated_at = id_payload.auth_time

        this.access = access_token
        this.refresh = refresh_token
        this.id = id_payload_raw
        this.it = id_payload

        this.isAuthenticated = true

        return this
    }

    saveStorage() {
        console.log("Saving")
        console.log(this.refresh)
        localStorage.setItem("id_payload", this.id)
        localStorage.setItem("access", this.access)
        localStorage.setItem("refresh", this.refresh)
    }

    clear(): AuthState {
        console.log("Clearing")
        this.username = ""
        this.scope = ""

        this.updated_at = 0

        this.id = ""
        this.it = null
        this.access = ""
        this.refresh = ""

        localStorage.removeItem("access")
        localStorage.removeItem("id_payload")
        localStorage.removeItem("refresh")

        this.isAuthenticated = false
        this.loginRequired = false
        // isLoaded is explicitly not changed

        return this
    }
}

export interface IAuth {
    authState: AuthState,
    setAuthState: Dispatch<SetStateAction<AuthState>>
}

const AuthContext = createContext({} as IAuth)

export const AuthProvider = AuthContext.Provider

export default AuthContext

export const useAuth = async (): Promise<AuthState> => {
    let as = new AuthState()
    as = as.loadFromStorage()

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
                as = as.clear()
            }
        } else {
            // Renewal not possible, logout
            as = as.clear()
        }
    } else if (as.loginRequired) {
        as = as.clear()
        // Logout
    } else {
        as.isAuthenticated = true
    }

    as.saveStorage()
    as.isLoaded = true
    return as
}

export const useLogout = (as: AuthState): AuthState => {
    as = as.clear()
    as.saveStorage()
    as.isLoaded = true
    return as
}

export const useRenewal = async (as: AuthState): Promise<AuthState> => {
    try {
        as = await renewAuth(as)
    } catch (e) {
        console.log(e)
        as = useLogout(as)
    }
    as.saveStorage()
    return as
}

export const renewAuth = async (as: AuthState) => {
    const {
        id_payload_raw, id_payload, access_token, refresh_token, scope
    } = await refresh_tokens(as.refresh)
    return as.loadFromRenewal(id_payload_raw, id_payload, access_token, refresh_token, scope);
}

export const handleTokenResponse = async (res: any) => {
    try {
        return await validateTokenResponse(res)
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

