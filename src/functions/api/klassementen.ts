import {Options} from "ky";
import {z} from "zod";
import {AuthUse} from "../../pages/Auth/AuthContext";
import {back_request} from "./api";

const KlassementData = z.object({
    firstname: z.string(),
    lastname: z.string(),
    user_id: z.string(),
    points: z.number()
})
export type KlassementData = z.infer<typeof KlassementData>;

const KlassementList = z.array(KlassementData)
export type KlassementList = z.infer<typeof KlassementList>;


export const klassement_request = async (auth: AuthUse, is_admin: boolean, rank_type: 'points'|'training', options?: Options): Promise<KlassementList> => {
    let role;
    if (is_admin) {
        role = "admin"
    } else {
        role = "members"
    }

    let response = await back_request(`${role}/class/get/${rank_type}/`, auth, options)
    const punt_klas: KlassementList = KlassementList.parse(response)
    punt_klas.sort((a, b) => {
        return b.points - a.points
    })
    return punt_klas
}

const UserIDData = z.object({
    user_id: z.string(),
})
export type UserIDData = {
    user_id: string
}

const UserIDList = z.array(UserIDData)

export const user_id_request = async (auth: AuthUse, options?: Options): Promise<Set<string>> => {
    let response = await back_request('admin/users/ids/', auth, options)
    const user_ids = UserIDList.parse(response).map(s => s.user_id)
    return new Set(user_ids)
}

const UserNames = z.object({
    user_id: z.string(),
    firstname: z.string(),
    lastname: z.string()
})
export type UserNames = z.infer<typeof UserNames>
const UserNamesList = z.array(UserNames)

export const user_names_request = async (auth: AuthUse, options?: Options): Promise<UserNames[]> => {
    let response = await back_request('admin/users/names/', auth, options)
    return UserNamesList.parse(response)
}