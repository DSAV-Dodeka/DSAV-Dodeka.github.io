import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './ConfirmUser.scss'

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {SignedUp, su_request} from "../../functions/api";
import AuthContext from "../Auth/AuthContext";
import {back_post} from "../../functions/api";

const columnHelper = createColumnHelper<SignedUp>()

const columns = [
    columnHelper.accessor('firstname', {
        header: () => 'Last Name',
    }),
    columnHelper.accessor('lastname', {
        header: () => 'Last Name',
    }),
    columnHelper.accessor('phone', {
        header: () => 'Phone',
    }),
    columnHelper.accessor('email', {
        header: () => 'Email',
    }),
    columnHelper.display({
        id: 'confirmer',
        cell: ({ row }) => {
            return row.getCanExpand() ? (
                <button onClick={row.getToggleExpandedHandler()}>{row.getIsExpanded() ? 'Sluit' : 'Bevestig'}</button>
            ) : (
                '🔵'
            )
        }
    })
]

const defaultData: SignedUp[] = [
    {
        firstname: 'Arnold',
        lastname: 'Aardvarken',
        phone: '+31612121212',
        email: 'arnold@dsavdodeka.nl'
    },
]

interface Props {
    access: string,
    refresh: string
}

const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.type = 'date';
}

const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    event.target.type = 'text';
}

const ConfirmUser: React.FC<Props> = (props) => {
    const {authState, setAuthState} = useContext(AuthContext)

    const [data, setData] = useState(() => [...defaultData])
    const rerender = useReducer(() => ({}), {})[1]

    const [av40Id, setAv40Id] = useState("")
    const [joined, setJoined] = useState("")

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
        const { sus, returnedState, changedState  } = await su_request(props.access, props.refresh, authState)
        if (changedState) {
            setAuthState(returnedState)
        }
        setData(sus)
    }

    useEffect(() => {
        if (authState.isLoaded && props.access) {
            loadBackend().catch()
        }

    }, [props.access]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

    }

    return (
        <div>
            <table>
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
                                <form onSubmit={handleSubmit}>
                                    <input id="av40id" type="text" placeholder="AV`40 nummer" name="av40id" value={av40Id} onChange={handleFormChange}/>
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
            <button onClick={() => doReload()}>
                Reload data
            </button>
        </div>
    )
}

export default ConfirmUser;
