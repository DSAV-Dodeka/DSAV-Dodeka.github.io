import config from "../../config"
import ky, {HTTPError, Options} from "ky"
import {z} from "zod";
import {AuthUse, useRenewal} from "../../pages/Auth/AuthContext";
import {NormalizedOptions} from "ky/distribution/types/options";
import {PagesError} from "../error";

const api = ky.create({prefixUrl: config.api_location});

export const back_get = async (endpoint: string, options?: Options) => {
    return await api.get(endpoint, {...options}).json()
}

export const back_post = async (endpoint: string, json: Object, options?: Options) => {
    return await api.post(endpoint, {json: json, ...options}).json()
}

const renewHook = (auth: AuthUse) => {
    return async (request: Request, options: NormalizedOptions, response: Response) => {
        if (!response.ok) {
            const {error, error_description, debug_key = ""} = await response.json()

            if (debug_key === "expired_access_token") {
                const newState = await useRenewal(auth.authState)

                auth.setAuthState(newState)

                if (newState.isAuthenticated) {
                    request.headers.set('Authorization', `Bearer ${newState.access}`)

                    return api(request);
                }
            }
        }
    }
}

export const back_post_auth = async (endpoint: string, json: Object, auth: AuthUse, options?: Options) => {
    const bearer = 'Bearer ' + auth.authState.access

    return await api.post(endpoint, {
        json: json,
        headers: {
            'Authorization': bearer,
        },
        hooks: {
            afterResponse: [
                renewHook(auth)
            ]
        },
        ...options
    }).json()
}

export const back_request = async (endpoint: string, auth: AuthUse, options?: Options) => {
    const bearer = 'Bearer ' + auth.authState.access
    return await api.get(endpoint, {
        headers: {
            'Authorization': bearer,
        },
        hooks: {
            afterResponse: [
                renewHook(auth)
            ]
        },
        ...options
    }).json()
}

const Profile = z.object({
    username: z.string(),
    scope: z.string(),
})
type Profile = z.infer<typeof Profile>;

export const profile_request = async (auth: AuthUse, options?: Options) => {
    let response = await back_request('res/profile/', auth, options)
    const profile: UserData = UserData.parse(response)
    return profile
}

const SignedUp = z.object({
    firstname: z.string(),
    lastname: z.string(),
    phone: z.string(),
    email: z.string()
})
export type SignedUp = z.infer<typeof SignedUp>;

const SignedUps = z.array(SignedUp)
type SignedUps = z.infer<typeof SignedUps>;

export const su_request = async (auth: AuthUse, options?: Options) => {
    let response = await back_request('onboard/get/', auth, options)
    const sus: SignedUps = SignedUps.parse(response)
    return sus
}

const UserData = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string(),
    user_id: z.string(),
    joined: z.string(),
    birthdate: z.string(),
})
export type UserData = z.infer<typeof UserData>;

const UsersData = z.array(UserData)
export type UsersData = z.infer<typeof UsersData>;

export const ud_request = async (auth: AuthUse, options?: Options): Promise<UsersData> => {
    let response = await back_request('admin/users/', auth, options)
    return UsersData.parse(response)
}

const ApiError = z.object({
    error: z.string(),
    error_description: z.string(),
    debug_key: z.string().optional()
})
export type ApiError = z.infer<typeof ApiError>;

export const catch_api = async (e: unknown): Promise<ApiError> => {
    if (e instanceof HTTPError) {
        const err_json = await e.response.json()
        return ApiError.parse(err_json)
    } else {
        throw e
    }
}

export const err_api = async (e: unknown) => {
    const err = await catch_api(e)
    return new PagesError(err.error, err.error_description, err.debug_key)
}

const BirthdayData = z.object({
    firstname: z.string(),
    lastname: z.string(),
    birthdate: z.string()
})
export type BirthdayData = z.infer<typeof BirthdayData>;

const Birthdays = z.array(BirthdayData);
type Birthdays = z.infer<typeof Birthdays>;

export const bd_request = async (auth: AuthUse, options?: Options) => {
    let response = await back_request('members/birthdays/', auth, options)
    const bds: Birthdays = Birthdays.parse(response)
    return bds
}

const RoleData = z.object({
    name: z.string(),
    user_id: z.string(),
    scope: z.array(z.string()),
})
export type RoleData = z.infer<typeof RoleData>;

export const u_ud_scopes_request = async (auth: AuthUse, options?: Options): Promise<Roles> => {
    let response = await back_request('admin/scopes/all/', auth, options)
    return Roles.parse(response)
}

const Roles = z.array(RoleData)
export type Roles = z.infer<typeof Roles>;

const RoleInfo = z.object({
    role: z.string(),
    color: z.string(),
})

export type RoleInfo = z.infer<typeof RoleInfo>;

const RolesInfo = z.object({
    roles: z.array(RoleInfo)
})

export type RolesInfo = z.infer<typeof RolesInfo>;

const DeleteUrl = z.object({
    delete_url: z.string()
})

export const delete_post = async(auth: AuthUse, options?: Options) => {
    let user_id = auth.authState.username
    const req = {
        user_id
    }
    const response = await back_post_auth('update/delete/url/', req, auth, options)
    const delete_url = DeleteUrl.parse(response).delete_url
    const url = new URL(delete_url)
    const base = url.protocol + "//" + url.host
    if (base === config.auth_location) {
        return delete_url
    } else {
        throw new PagesError("invalid_url", `URL base ${base} is not valid.`)
    }
}

const PR = z.object({
    naam: z.string(),
    onderdeel: z.string(),
    prestatie: z.string(),
    datum: z.string(),
    plaats: z.string(),
    link: z.string()
})

export type PR = z.infer<typeof PR>;

const PRs = z.object({
    prs: z.array(PR)
})

export type PRs = z.infer<typeof PRs>;