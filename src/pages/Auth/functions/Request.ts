import config from "../../../config"
import ky from "ky"
import {AuthState, refresh_tokens, useAuth} from "../AuthContext";
import {z} from "zod";

const api = ky.create({prefixUrl: config.api_location});

const Profile = z.object({
    username: z.string(),
    scope: z.string(),
})
type Profile = z.infer<typeof Profile>;

export const back_request = async (endpoint: string, access: string, refresh: string, as: AuthState) => {
    let returnedState = as
    let changedState = false
    const bearer = 'Bearer ' + access
    const response = await api.get(endpoint, {
        headers: {
            'Authorization': bearer,
        },
        hooks: {
            afterResponse: [
                // Or retry with a fresh token on a 403 error
                async (request, options, response) => {
                    const { error, error_description, debug_key="" } = await response.json()

                    if (debug_key === "expired_access_token") {
                        const refreshed = await refresh_tokens(refresh)
                        if (refreshed) {
                            returnedState = await useAuth()
                            changedState = true
                            const new_access = localStorage.getItem("access")

                            // Retry with the token
                            request.headers.set('Authorization', `Bearer ${new_access}`)

                            return api(request);
                        }
                    }
                }
            ]
        }
    }).json()

    return { response, returnedState, changedState }
}

export const profile_request = async (access: string, refresh: string, as: AuthState) => {
    let { response, returnedState, changedState } = await back_request('res/profile', access, refresh, as)
    const profile: Profile = Profile.parse(response)
    return { profile, returnedState, changedState }
}