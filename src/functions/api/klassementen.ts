import {Options} from "ky";
import {z} from "zod";
import {AuthUse} from "../../pages/Auth/AuthContext";
import {back_request} from "./api";

const EventType = z.object({
    type: z.string(),
    default_points: z.number()
})

export type EventType = z.infer<typeof EventType>;

const PuntenKlassementData = z.object({
    firstname: z.string(),
    lastname: z.string(),
    user_id: z.string(),
    points: z.number()
})
export type PuntenKlassementData = z.infer<typeof PuntenKlassementData>;

const PuntenKlassement = z.array(PuntenKlassementData)
export type PuntenKlassement = z.infer<typeof PuntenKlassement>;


export const punten_klassement_request = async (auth: AuthUse, options?: Options) => {
    let response = await back_request('members/classification/points', auth, options)
    const punt_klas: PuntenKlassement = PuntenKlassement.parse(response)
    punt_klas.sort((a, b) => {
        return b.points - a.points
    })
    return punt_klas
}

const TrainingsKlassementData = z.object({
    firstname: z.string(),
    lastname: z.string(),
    user_id: z.string(),
    points: z.number()
})
export type TrainingsKlassementData = z.infer<typeof PuntenKlassementData>;

const TrainingsKlassement = z.array(PuntenKlassementData)

export type TrainingsKlassement = z.infer<typeof PuntenKlassement>;

export const trainings_klassement_request = async (auth: AuthUse, options?: Options) => {
    let response = await back_request('members/classification/training', auth, options)
    const punt_klas: TrainingsKlassement = TrainingsKlassement.parse(response)
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
    let response = await back_request('admin/users/ids', auth, options)
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
    let response = await back_request('admin/users/names', auth, options)
    return UserNamesList.parse(response)
}