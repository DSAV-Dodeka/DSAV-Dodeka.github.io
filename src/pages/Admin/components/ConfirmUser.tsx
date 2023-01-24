import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './table.scss'

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {back_post_auth, catch_api, err_api, SignedUp, su_request} from "../../../functions/api";
import AuthContext from "../../Auth/AuthContext";
import {back_post} from "../../../functions/api";
import {queryError, useSignedUpQuery, useUserDataQuery} from "../../../functions/queries";
import {useQueryClient} from "@tanstack/react-query";

const columnHelper = createColumnHelper<SignedUp>()

const defaultData: SignedUp[] = [
    // {
    //     firstname: 'Arnold',
    //     lastname: 'Aardvarken',
    //     phone: '+31612121212',
    //     email: 'arnold@dsavdodeka.nl'
    // },
    // {
    //     firstname: 'Arnold',
    //     lastname: 'Aardvarken',
    //     phone: '+31612121212',
    //     email: 'arnold@dsavdodeka.nl'
    // },
]

const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.type = 'date';
}

const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.target.type = 'text';
}

const ConfirmUser = () => {
    const columns = [
        columnHelper.accessor('firstname', {
            header: () => 'Voornaam',
        }),
        columnHelper.accessor('lastname', {
            header: () => 'Achternaam',
        }),
        columnHelper.accessor('phone', {
            header: () => 'Telefoonnummer',
        }),
        columnHelper.accessor('email', {
            header: () => 'E-mailadres',
        }),
        columnHelper.display({
            id: 'confirmer',
            header: () => {
                return (
                    <svg xmlns="http://www.w3.org/2000/svg"
                    width="30" height="30"
                    viewBox="0 0 30 30"
                    onClick={() => doReload()}><path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path></svg>)
            },
            cell: ({ table, row }) => {
                return row.getCanExpand() ? (
                    <button onClick={() => {
                        table.toggleAllRowsExpanded(false)
                        row.toggleExpanded(!row.getIsExpanded())
                    }}>{row.getIsExpanded() ? 'Sluit' : 'Bevestig'}</button>
                ) : (
                    '🔵'
                )
            }
        })
    ]

    const {authState, setAuthState} = useContext(AuthContext)
    const queryClient = useQueryClient()

    const q = useSignedUpQuery({authState, setAuthState})
    const data = queryError(q, defaultData, "Confirm User Query Error")

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
        queryClient.invalidateQueries({ queryKey: ['su'] }).then()
    }

    const handleSubmit = (e: FormEvent, su: SignedUp) => {
        e.preventDefault()
        const signup_confirm = {
            email: su.email,
            av40id: av40Id,
            joined: joined
        }
        back_post_auth("onboard/confirm/", signup_confirm, {authState, setAuthState}).then(() => {
            setStatus(`Inschrijving for ${su.firstname} ${su.lastname} bevestigd!`)
            doReload()
        })
    }

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
                        {row.getIsExpanded() && (
                            <tr><td colSpan={row.getVisibleCells().length}>
                                <form className="bevestig_inschrijving" onSubmit={(e) => handleSubmit(e, row.original)}>
                                    <input id="av40id" type="text" placeholder="AV'40 lidnummer" name="av40id" value={av40Id} onChange={handleFormChange}/>
                                    <br/>
                                    <input id="joined" type="text" placeholder="Lid sinds" name="joined" value={joined} onFocus={handleFocus} onBlur={handleBlur} onChange={handleFormChange}/>
                                    <br/>
                                    <button id="submit_button" type="submit">Bevestig inschrijving</button>
                                </form>
                            </td></tr>
                        )}
                    </Fragment>
                ))}
                </tbody>
            </table>
            <div/><br/>
            <div className="confirmStatus">{status}</div>
        </div>
    )
}

export default ConfirmUser;
