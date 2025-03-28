import {
    bd_request,
    BirthdayData,
    err_api,
    SignedUp,
    su_request,
    ud_request,
    profile_request,
    u_ud_scopes_request
} from "./api/api";
import {
    class_get_meta_request,
    klassement_request,
    klassement_with_info_request,
    user_id_request, user_names_request
} from "./api/klassementen";
import {useQuery, UseQueryResult} from "@tanstack/react-query";
import {AuthUse} from "../pages/Auth/AuthContext";
import {Logger} from "./logger";

export const queryError = <T>(q: UseQueryResult<T>, defaultData: T, error: string): T => {
    const {isError, isPending, error: e, data} = q

    if (!isError && !isPending) {
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
    useQuery({
        queryKey: ['ud'],
        queryFn: () => ud_request(au),
        staleTime,
        enabled: au.authState.isAuthenticated
    })

export const useBirthdayDataQuery = (au: AuthUse) =>
    useQuery({
        queryKey: ['bd'],
        queryFn: () => bd_request(au),
        staleTime: longStaleTime,
        gcTime: longCacheTime,
        enabled: au.authState.isAuthenticated
    })

export const useSignedUpQuery = (au: AuthUse) =>
    useQuery({
        queryKey: ['su'],
        queryFn: () => su_request(au),
        staleTime,
        enabled: au.authState.isAuthenticated
    })

export const useKlassementQuery = (au: AuthUse, rank_type: 'points'|'training') =>
        useQuery({
            queryKey: [`tr_klass_info_${rank_type}`],
            queryFn: () => klassement_with_info_request(au, rank_type),
            staleTime: longStaleTime,
            gcTime: longCacheTime,
            enabled: au.authState.isAuthenticated
        })

export const useAdminKlassementQuery = (au: AuthUse, rank_type: 'points'|'training') =>
            useQuery({
                queryKey: [`tr_klass_admin_${rank_type}`],
                queryFn: () => klassement_request(au, true, rank_type),
                staleTime: longStaleTime,
                gcTime: longCacheTime,
                enabled: au.authState.isAuthenticated
            })

export const useUserIdQuery = (au: AuthUse) =>
    useQuery({
        queryKey: ['u_id'],
        queryFn: () => user_id_request(au),
        staleTime: longStaleTime,
        gcTime: longCacheTime,
        enabled: au.authState.isAuthenticated
    })

export const useUserNamesQuery = (au: AuthUse) =>
    useQuery({
        queryKey: ['u_names'],
        queryFn: () => user_names_request(au),
        staleTime: longStaleTime,
        gcTime: longCacheTime,
        enabled: au.authState.isAuthenticated
    })

export const useProfileQuery = (au: AuthUse) =>
    useQuery({
        queryKey: ['profile'],
        queryFn: () => profile_request(au),
        staleTime: longStaleTime,
        gcTime: longCacheTime,
        enabled: au.authState.isAuthenticated
    })

export const useUserScopeQuery = (au: AuthUse) =>
    useQuery({
        queryKey: ['u_ud_scope'],
        queryFn: () => u_ud_scopes_request(au),
        staleTime,
        enabled: au.authState.isAuthenticated
    })

export const useClassMetaQuery = (au: AuthUse) =>
    useQuery({
        queryKey: ['class_meta'],
        queryFn: () => class_get_meta_request(au),
        staleTime,
        enabled: au.authState.isAuthenticated
    })