import config from "../config"
import ky, {HTTPError} from "ky"
import {z} from "zod";
import {IAuth, useRenewal} from "../pages/Auth/AuthContext";

const api = ky.create({prefixUrl: config.api_location});

export const back_post = async (endpoint: string, json: Object) => {
    return await api.post(endpoint, {json: json}).json()
}

// export const back_post_auth = async (endpoint: string, json: Object) => {
//     return api.post(endpoint, {
//         json: json,
//         headers: {
//             'Authorization': bearer,
//         },
//
//     })
// }


const Profile = z.object({
    username: z.string(),
    scope: z.string(),
})
type Profile = z.infer<typeof Profile>;

export const back_request = async (endpoint: string, auth: IAuth) => {
    const bearer = 'Bearer ' + auth.authState.access
    return await api.get(endpoint, {
        headers: {
            'Authorization': bearer,
        },
        hooks: {
            afterResponse: [
                // Or retry with a fresh token on a 403 error
                async (request, options, response) => {
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
            ]
        }
    }).json()
}

export const profile_request = async (auth: IAuth) => {
    let response = await back_request('res/profile', auth)
    const profile: Profile = Profile.parse(response)
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

export const su_request = async (access: string, refresh: string, auth: IAuth) => {
    let response = await back_request('onboard/get', auth)
    const sus: SignedUps = SignedUps.parse(response)
    return sus
}

const ApiError = z.object({
    error: z.string(),
    error_description: z.string(),
    debug_key: z.string()
})
type ApiError = z.infer<typeof ApiError>;

export const catch_api = async (e: unknown): Promise<ApiError> => {
    if (e instanceof HTTPError) {
        const err_json = await e.response.json()
        return ApiError.parse(err_json)
    } else {
        throw e
    }
}