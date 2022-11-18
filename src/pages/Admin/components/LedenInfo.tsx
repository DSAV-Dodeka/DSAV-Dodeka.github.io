import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './ConfirmUser.scss'

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {UserData, ud_request, catch_api} from "../../../functions/api";
import AuthContext from "../../Auth/AuthContext";
import "./LedenInfo.scss";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";

const columnHelper = createColumnHelper<UserData>()

const columns = [
    columnHelper.accessor('firstname', {
        header: () => 'Voornaam',
    }),
    columnHelper.accessor('lastname', {
        header: () => 'Achternaam',
    }),
    columnHelper.accessor('birthdate', {
        header: () => 'Geboortedatum',
    }),
    columnHelper.accessor('email', {
        header: () => 'E-mailadres',
    }),
    columnHelper.accessor('phone', {
        header: () => 'Telefoonnummer',
    }),
    columnHelper.accessor('callname', {
        header: () => 'Roepnaam',
    }),
    columnHelper.accessor('av40id', {
        header: () => 'AV`40 nummer',
    }),
    columnHelper.accessor('joined', {
        header: () => 'Lid sinds',
    }),
    columnHelper.accessor('eduinstitution', {
        header: () => 'Onderwijsinstelling',
    }),
]

const defaultData: UserData[] = [
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        phone: '+31612121212',
        email: 'arnold@dsavdodeka.nl',
        user_id: '0_arnold',
        callname: 'Arnold',
        av40id: 12,
        joined: '2022-02-25',
        eduinstitution: 'TU Delft',
        birthdate: '2022-02-25',
        registered: false
    },
]

const getData = () => {
    return defaultData
}

const LedenInfo = () => {
    const {authState, setAuthState} = useContext(AuthContext)

    const queryClient = useQueryClient()

    // Queries
    const { isLoading, error, data: d, isFetching } = useQuery({ queryKey: ['todos'], queryFn: getData })

    const [data, setData] = useState(() => [...defaultData])
    const rerender = useReducer(() => ({}), {})[1]

    const [av40Id, setAv40Id] = useState("")
    const [joined, setJoined] = useState("")

    const [status, setStatus] = useState("")

    const table = useReactTable({
        data,
        columns,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        if (name === "av40id") {
            setAv40Id(value)
        } else if (name === "joined") {
            setJoined(value)
        }
    }

    const doReload = () => {
        loadBackend().then(() => rerender())
    }

    const loadBackend = async () => {
        try {
            const uds = await ud_request({authState, setAuthState})
            setData(uds)
        } catch (e) {
            const err_api = await catch_api(e)
            console.error(err_api)
        }
    }

    useEffect(() => {
        if (authState.isLoaded && authState.access) {
            loadBackend().catch()
        }

    }, [authState.access]);

    return (
        <div>
            <table className="leden_table">
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                    )}
                                </th>
                            )
                        })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.length === 0 && (
                    <tr>
                        <td colSpan={5}>Er zijn helaas geen nieuwe aanmeldingen</td>
                    </tr>
                )}
                {table.getRowModel().rows.map(row => (
                    <Fragment key={row.id}>
                        <tr>
                            {/* first row is a normal row */}
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    </Fragment>
                ))}
                </tbody>
            </table>
            <div/><br/>
            <div className="confirmStatus">{status}</div>
        </div>
    )
}

export default LedenInfo;
