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
import {UserData, ud_request, catch_api, RoleData, RoleInfo, back_post_auth} from "../../../functions/api";
import AuthContext from "../../Auth/AuthContext";
import "./Rollen.scss";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {queryError, useSignedUpQuery, useUserDataQuery, useUserScopeQuery} from "../../../functions/queries";
import RollenInfo from "../../../content/Rollen.json";

const getColor = (role: string) => {
    for (let i = 0; i < RollenInfo.rollen.length; i++) {
        if (RollenInfo.rollen[i].rol === role) {
            return RollenInfo.rollen[i].kleur;
        }
    }
    return "#000000";
}

const getTextColor = (role: string) => {
    for (let i = 0; i < RollenInfo.rollen.length; i++) {
        if (RollenInfo.rollen[i].rol === role) {
            return (RollenInfo.rollen[i].light ? "#000000": "#ffffff");
        }
    }
    return "#ffffff";
}

const handleSubmitRole = (e: FormEvent) => {
    e.preventDefault()
}

const handleDeleteRole = (e: FormEvent) => {
    e.preventDefault()
}

const columnHelper = createColumnHelper<RoleData>()

const columns = [
    columnHelper.accessor('name', {
        header: () => 'Naam',
    }),
    columnHelper.accessor('scope', {
        header: () => 'Rollen',
        enableSorting: false,
        cell: info => <div className="role_list">{info.getValue().map(item => <p className="role_icon" style={{backgroundColor: getColor(item), color: getTextColor(item)}}>{item} <svg xmlns="http://www.w3.org/2000/svg" className="role_delete" style={{fill: getTextColor(item)}} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg></p>)}</div>
    })
]

const defaultData: RoleData[] = [
    {
        name: 'Brnold het Aardvarken',
        user_id: '0_arnold',
        scope: ['Bestuur', '.ComCom']
    },
    {
        name: 'Arnold het Aardvarken',
        user_id: '1_arnold',
        scope: ['Bestuur']
    },
    {
        name: 'Arnold het Aardvarken',
        user_id: '2_arnold',
        scope: ['.ComCom']
    },
]

const roleData: RoleInfo[] = [
    {
        role: 'Bestuur',
        color: '#001f48',
    },
    {
        role: '.ComCom',
        color: '#73AF59',
    },
]

const Rollen = () => {
    const rerender = React.useReducer(() => ({}), {})[1]

    const {authState, setAuthState} = useContext(AuthContext)
    const [addRoleUser, setAddRoleUser] = useState("none");
    const [roleToAdd, setRoleToAdd] = useState(roleData[0].role)
    const [manageRoles, setManageRoles] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([])

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setRoleToAdd(event.target.value)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        console.log({addRoleUser, roleToAdd})

        const req = {
            "user_id": addRoleUser,
            "scope": roleToAdd
        }

        await back_post_auth("admin/scopes/add/", req, {authState, setAuthState})

        await refetch()
    }

    // const q = useUserDataQuery({ authState, setAuthState })
    // const data = queryError(q, defaultData, "User Info Query Error")
    const q = useUserScopeQuery({ authState, setAuthState })
    const refetch = () => q.refetch()
    const data = queryError(q, defaultData, "User Scope Data Query Error")

    const table = useReactTable<RoleData>({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
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
                                        <div onClick={header.column.getToggleSortingHandler()} className={(header.column.getCanSort() ? "canSort" : "")}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' ↑',
                                                desc: ' ↓'
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    )}
                                </th>
                            )
                        })}
                        {/* <th/> */}
                        <th ><p className="leden_table_header_button" onClick={() => setManageRoles(true)}>Beheer rollen</p></th>
                    </tr>
                ))}
                </thead>
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
                                            cell.getContext(),
                                        )}
                                    </td>
                                )
                            })}
                            <td>
                                <>
                                    {addRoleUser !== row.original.user_id && (<p className="leden_table_row_button" onClick={() => setAddRoleUser(row.original.user_id)}>Voeg rol toe</p>)}
                                    {addRoleUser === row.original.user_id && (
                                        <form className="add_role" onSubmit={handleSubmit}>
                                            <select value={roleToAdd} onChange={handleSelectChange}>
                                                {RollenInfo.rollen.map((item) => {
                                                    return <option>{item.rol}</option>;
                                                })}
                                            </select>
                                            <button className="leden_table_row_button">Voeg toe</button>
                                        </form>
                                    )}
                                </>
                            </td>
                        </tr>
                    </Fragment>
                ))}
                </tbody>
            </table>
            <div/><br/>
            {manageRoles && 
                <>
                <div className="manage_roles_container" />
                <div className="manage_roles">
                <svg xmlns="http://www.w3.org/2000/svg" className="manage_roles_cross" onClick={() => setManageRoles(false)} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg>
                    <p className="manage_roles_title">Rollenbeheer</p>
                    <p className="manage_roles_header">Huidige rollen</p>
                    <div className="manage_roles_roles">
                        {RollenInfo.rollen.map((role) => {
                            return <div className="manage_roles_role">
                                <p className="manage_roles_icon" style={{backgroundColor: role.kleur, color: (role.light ? "black" : "white")}}>{role.rol} </p>
                                <button className="manage_roles_delete" onClick={handleDeleteRole}>Verwijder rol</button>
                                </div>
                        })}
                    </div>
                    <form className="submit_role">
                        <input className="submit_role_input" type="text" placeholder="Nieuwe rol"></input>
                        <input className="submit_role_color" type="color" value="#001f48"></input>
                        <button className="leden_table_row_button" onClick={handleSubmitRole}>Voeg toe</button>
                    </form>

                </div>
                </>
                
            }
        </div>
    )
}

export default Rollen;
