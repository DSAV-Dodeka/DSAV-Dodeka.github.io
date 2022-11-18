import {back_get} from "./api";
import {z} from "zod";
import {QueryClient, useMutation, useQuery} from "@tanstack/react-query";
import {PagesError} from "./error";
import {AuthState} from "../pages/Auth/AuthContext";

const Root = z.object({
    Hallo: z.string(),
})
export type Root = z.infer<typeof Root>;

const fetchRoot = async (): Promise<Root> => {
    const response = await back_get("")

    return Root.parse(response)
}

const fetchRefresh = async (): Promise<string> => {
    const refresh = localStorage.getItem("refresh")

    if (refresh === null) {
        throw new PagesError("no_refresh_saved", "No refresh token is stored while it was expected!")
    } else {
        return refresh
    }
}

const fetchAuthState = async (refresh: string): Promise<AuthState> => {

}

export const useAuthQuery = (queryClient: QueryClient) =>
    useQuery(['root'], () => fetchRoot(),
        {
            keepPreviousData: true,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false
        })

export const useRefreshQuery = (queryClient: QueryClient) =>
    useMutation({
        mutationKey: ["refresh"],
        mutationFn: fetchRefresh,
        onError: async () => {
            await queryClient.invalidateQueries({ queryKey: ['access'] })
        },

    })


export const useRootQuery = () =>

    useQuery(['root'], () => fetchRoot(),
        {
            keepPreviousData: true,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false
        })