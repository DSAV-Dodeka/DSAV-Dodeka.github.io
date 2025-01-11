import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel
} from '@tanstack/react-table'
import {UserData, ud_request, catch_api} from "../../../functions/api/api";
import AuthContext from "../../Auth/AuthContext";
import "./table.scss";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {queryError, useSignedUpQuery, useUserDataQuery} from "../../../functions/queries";
import { exportCSV } from "../functions/parse";
import SortHeader from "./SortHeader";

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
        enableSorting: false,
    }),
    columnHelper.accessor('phone', {
        header: () => 'Telefoonnummer',
        enableSorting: false,
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
        email: 'arnold@dsavdodeka.nl',
        user_id: '0_arnold',
        joined: '2022-02-25',
        birthdate: '2022-02-25',
    },
]

const LedenInfo = () => {
    const {authState, setAuthState} = useContext(AuthContext)

    const [sorting, setSorting] = useState<SortingState>([])

    const q = useUserDataQuery({ authState, setAuthState })
    const data = queryError(q, defaultData, "User Info Query Error")

    const table = useReactTable<UserData>({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    })

    return (
        <div>
            <button className="export_button" onClick={() => exportCSV(data, "Ledeninformatie.csv")}>Exporteer</button>
            <table className="leden_table">
                <SortHeader table={table} />
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
