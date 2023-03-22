import { Options } from "ky";
import { z } from "zod";
import { AuthUse } from "../../pages/Auth/AuthContext";
import { back_request } from "./api";


const PuntenKlassementData = z.object({
    Naam: z.string(),
    Punten: z.number()
})
export type PuntenKlassementData = z.infer<typeof PuntenKlassementData>;

const PuntenKlassement = z.object({
    points: z.array(PuntenKlassementData)
})
export type PuntenKlassement = z.infer<typeof PuntenKlassement>;

export const punten_klassement_request = async (auth: AuthUse, options?: Options) => {
    let response = await back_request('members/rankings/points', auth, options)
    const punt_klas: PuntenKlassement = PuntenKlassement.parse(response)
    return punt_klas
}

const EventType = z.object({
    type: z.string(),
    default_points: z.number()
})

export type EventType = z.infer<typeof EventType>;

const TrainingsKlassementData = z.object({
    Naam: z.string(),
    Punten: z.number()
})
export type TrainingsKlassementData = z.infer<typeof TrainingsKlassementData>;

const TrainingsKlassement = z.object({
    points: z.array(TrainingsKlassementData)
})
export type TrainingsKlassement = z.infer<typeof TrainingsKlassement>;


export const trainings_klassement_request = async (auth: AuthUse, options?: Options) => {
    let response = await back_request('members/rankings/training', auth, options)
    const train_klas: TrainingsKlassement = TrainingsKlassement.parse(response)
    return train_klas
}