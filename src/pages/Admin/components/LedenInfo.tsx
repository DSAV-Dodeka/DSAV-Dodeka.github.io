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
import {queryError, useSignedUpQuery, useUserDataQuery} from "../../../functions/queries";

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
        header: () => 'AV\'40 nummer',
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

    const q = useUserDataQuery({ authState, setAuthState })
    const data = queryError(q, defaultData, "User Info Query Error")

    const table = useReactTable<UserData>({
        data,
        columns,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
    })

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
        </div>
    )
}

export default LedenInfo;
