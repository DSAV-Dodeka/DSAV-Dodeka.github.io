import {bd_request, BirthdayData, err_api, SignedUp, su_request, ud_request, UsersData, punten_klassement_request, PuntenKlassementData, trainings_klassement_request, TrainingsKlassementData, TrainingsKlassement} from "./api";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {AuthUse} from "../pages/Auth/AuthContext";
import {Logger} from "./logger";

const fetchBirthdayData = async (au: AuthUse): Promise<BirthdayData[]> => {
    return bd_request(au)
}

const fetchUserData = async (au: AuthUse): Promise<UsersData> => {
    return ud_request(au)
}

const fetchSignedUp = async (au: AuthUse): Promise<SignedUp[]> => {
    return su_request(au)
}

const fetchPuntenKlassementData = async (au: AuthUse): Promise<PuntenKlassementData[]> => {
    return punten_klassement_request(au)
}

const fetchTrainingsKlassementData = async (au: AuthUse): Promise<TrainingsKlassement> => {
    return trainings_klassement_request(au)
}

export const queryError = <T>(q: UseQueryResult<T>, defaultData: T, error: string): T => {
    const {isError, isLoading, error: e, data} = q

    if (!isError && !isLoading) {
        return data
    } else if (isError) {
        err_api(e).then((err) => {
            Logger.warn({[`Query error ${error}`]: err.j()})
        }).catch((e) => {
            Logger.error({[`Query error ${error}`]: e})
        })
    }
    return defaultData
}

const staleTime = 1000 * 7 // 7 seconds

export const useUserDataQuery = (au: AuthUse) =>
    useQuery(['ud'], () => fetchUserData(au),
        {
            staleTime,
            enabled: au.authState.isAuthenticated,
        })

export const useBirthdayDataQuery = (au: AuthUse) =>
    useQuery(['whatIsThis'], () => fetchBirthdayData(au),
        {
            staleTime,
            enabled: au.authState.isAuthenticated,
        })

export const useSignedUpQuery = (au: AuthUse) =>
    useQuery(['su'], () => fetchSignedUp(au),
        {
            staleTime,
            enabled: au.authState.isAuthenticated,
        })

export const usePuntenKlassementQuery = (au: AuthUse) =>
    useQuery(['whatIsThis'], () => fetchPuntenKlassementData(au),
        {
            staleTime,
            enabled: au.authState.isAuthenticated,
        })

export const useTrainingsKlassementQuery = (au: AuthUse) =>
        useQuery(['whatIsThis'], () => fetchTrainingsKlassementData(au),
            {
                staleTime,
                enabled: au.authState.isAuthenticated,
            })