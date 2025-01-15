import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './table.scss'

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel
} from '@tanstack/react-table'
import {UserData, ud_request, catch_api, PR} from "../../../functions/api/api";
import AuthContext from "../../Auth/AuthContext";
import "./PrCheck.scss";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {queryError, useSignedUpQuery, useUserDataQuery} from "../../../functions/queries";
import SortHeader from "./SortHeader";

const columnHelper = createColumnHelper<PR>()

const columns = [
    columnHelper.accessor('naam', {
        header: () => 'Naam',
    }),
    columnHelper.accessor('onderdeel', {
        header: () => 'Onderdeel',
    }),
    columnHelper.accessor('prestatie', {
        header: () => 'Prestatie',
    }),
    columnHelper.accessor('datum', {
        header: () => 'Datum',
    }),
    columnHelper.accessor('plaats', {
        header: () => 'Plaats',
    }),
    columnHelper.accessor('link', {
        header: () => 'Link',
    }),
]

const defaultData: PR[] = [
    {
        naam: 'Arnold',
        onderdeel: "1500m",
        prestatie: "3:59,99",
        datum: "12-12-2012",
        plaats: "Delft",
        link: "www.arnold.nl"
    }
]

const Rollen = () => {
    const {authState, setAuthState} = useContext(AuthContext)
    const [addRole, setAddRole] = useState("none");
    const [sorting, setSorting] = useState<SortingState>([])

    // const q = useUserDataQuery({ authState, setAuthState })
    // const data = queryError(q, defaultData, "User Info Query Error")
    const data = defaultData;

    const table = useReactTable<PR>({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    const otherHeader = <th key={"accept"} colSpan={2}></th>

    return (
        <div>
            <table className="leden_table">
                <SortHeader table={table} OtherHeader={otherHeader} />
                <tbody>
                {table.getRowModel().rows.length === 0 && (
                    <tr>
                        <td colSpan={5}>Er zijn helaas geen gegevens beschikbaar.</td>
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
                            <td>
                                <>
                                    {addRole !== row.id && (<p className="leden_table_row_button" onClick={() => setAddRole(row.id)}>✓</p>)}
                                </>
                            </td>
                        </tr>
                    </Fragment>
                ))}
                </tbody>
            </table>
            <div/>
        </div>
    )
}

export default Rollen;
