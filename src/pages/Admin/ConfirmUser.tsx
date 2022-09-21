import React, {useContext, useEffect, useReducer, useState} from "react";
import {z} from "zod";
import './ConfirmUser.scss'

import {
    createColumnHelper,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {SignedUp, su_request} from "../Auth/functions/Request";
import AuthContext from "../Auth/AuthContext";
import {back_post} from "../../functions/api";

const columnHelper = createColumnHelper<SignedUp>()

const columns = [
    columnHelper.accessor('firstname', {
        cell: info => info.getValue(),
        header: () => 'First Name',
    }),
    columnHelper.accessor('lastname', {
        cell: info => info.getValue(),
        header: () => 'Last Name',
    }),
    columnHelper.accessor('phone', {
        header: () => 'Phone',
    }),
    columnHelper.accessor('email', {
        header: () => 'Email',
    }),
]

const defaultData: SignedUp[] = [
    {
        firstname: 'tanner',
        lastname: 'linsley',
        phone: '+3161',
        email: 'tanner@linsley.nl'
    },
    {
        firstname: 'tandy',
        lastname: 'miller',
        phone: '+3162',
        email: 'tandy@miller.nl'
    },
    {
        firstname: 'joe',
        lastname: 'dirte',
        phone: '+3163',
        email: 'joe@dirte.nl'
    },
]

interface Props {
    access: string,
    refresh: string
}

const ConfirmUser: React.FC<Props> = (props) => {
    const {authState, setAuthState} = useContext(AuthContext)

    const [data, setData] = useState(() => [...defaultData])
    const rerender = useReducer(() => ({}), {})[1]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const loadBackend = async () => {
        const { sus, returnedState, changedState  } = await su_request(props.access, props.refresh, authState)
        if (changedState) {
            setAuthState(returnedState)
        }
        setData(sus)
    }

    const handleClick = (p: SignedUp) => {
        console.log(p)
    }

    useEffect(() => {
        if (authState.isLoaded && props.access) {
            loadBackend().catch()
        }

    }, [props.access]);

    return (
        <div>
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                        <td key={"b" + row.id}><button onClick={() => handleClick(row.original)}>Confirm</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div/>
            <button onClick={() => rerender()}>
                Rerender
            </button>
        </div>
    )
}

export default ConfirmUser;
