import {
    bd_request,
    BirthdayData,
    err_api,
    SignedUp,
    su_request,
    ud_request,
    UsersData,
    UserData,
    profile_request,
    u_ud_scopes_request
} from "./api/api";
import {
    punten_klassement_request,
    PuntenKlassement,
    trainings_klassement_request,
    TrainingsKlassementData,
    TrainingsKlassement
} from "./api/klassementen";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {AuthUse} from "../pages/Auth/AuthContext";
import {Logger} from "./logger";

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
const longStaleTime = 1000 * 60 * 30 // 30 minutes
const longCacheTime = (1000 * 60) * 35 // 35 minutes

export const useUserDataQuery = (au: AuthUse) =>
    useQuery(['ud'], () => ud_request(au),
        {
            staleTime,
            enabled: au.authState.isAuthenticated,
        })

export const useBirthdayDataQuery = (au: AuthUse) =>
    useQuery(['bd'], () => bd_request(au),
        {
            staleTime: longStaleTime,
            cacheTime: longCacheTime,
            enabled: au.authState.isAuthenticated,
        })

export const useSignedUpQuery = (au: AuthUse) =>
    useQuery(['su'], () => su_request(au),
        {
            staleTime,
            enabled: au.authState.isAuthenticated,
        })

export const usePuntenKlassementQuery = (au: AuthUse) =>
    useQuery(['pt_klass'], () => punten_klassement_request(au),
        {
            staleTime: longStaleTime,
            cacheTime: longCacheTime,
            enabled: au.authState.isAuthenticated,
        })

export const useTrainingsKlassementQuery = (au: AuthUse) =>
        useQuery(['tr_klass'], () => trainings_klassement_request(au),
            {
                staleTime: longStaleTime,
                cacheTime: longCacheTime,
                enabled: au.authState.isAuthenticated,
            })

export const useProfileQuery = (au: AuthUse) =>
    useQuery(['profile'], () => profile_request(au),
        {
            staleTime: longStaleTime,
            cacheTime: longCacheTime,
            enabled: au.authState.isAuthenticated,
        })

export const useUserScopeQuery = (au: AuthUse) =>
    useQuery(['u_ud_scope'], () => u_ud_scopes_request(au),
        {
            staleTime,
            enabled: au.authState.isAuthenticated,
        })