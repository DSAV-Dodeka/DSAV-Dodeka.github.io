import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './table.scss'

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {UserData, ud_request, catch_api, RolesData, RoleInfo} from "../../../functions/api";
import AuthContext from "../../Auth/AuthContext";
import "./Rollen.scss";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {queryError, useSignedUpQuery, useUserDataQuery} from "../../../functions/queries";

const getColor = (role: string) => {
    for (var i = 0; i < roleData.length; i++) {
        if (roleData[i].role === role) {
            return roleData[i].color;
        }
    }
    return "#000000";
}

const handleSubmit = (e: FormEvent) => {
    
}

const handleSubmitRole = (e: FormEvent) => {

}

const handleDeleteRole = (e: FormEvent) => {

}

const columnHelper = createColumnHelper<RolesData>()

const columns = [
    columnHelper.accessor('name', {
        header: () => 'Naam',
    }),
    columnHelper.accessor('roles', {
        header: () => 'Rollen',
        cell: info => <div className="role_list">{info.getValue().map(item => <p className="role_icon" style={{backgroundColor: getColor(item)}}>{item} <svg xmlns="http://www.w3.org/2000/svg" className="role_delete" viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg></p>)}</div>
    })
]

const defaultData: RolesData[] = [
    {
        name: 'Arnold het Aardvarken',
        user_id: '0_arnold',
        roles: ['Bestuur', '.ComCom']
    },
    {
        name: 'Arnold het Aardvarken',
        user_id: '0_arnold',
        roles: ['Bestuur']
    },
    {
        name: 'Arnold het Aardvarken',
        user_id: '0_arnold',
        roles: ['.ComCom']
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
    const {authState, setAuthState} = useContext(AuthContext)
    const [addRole, setAddRole] = useState("none");
    const [manageRoles, setManageRoles] = useState(false);

    // const q = useUserDataQuery({ authState, setAuthState })
    // const data = queryError(q, defaultData, "User Info Query Error")
    const data = defaultData;

    const table = useReactTable<RolesData>({
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
                                            cell.getContext()
                                        )}
                                    </td>
                                )
                            })}
                            <td>
                                <>
                                    {addRole !== row.id && (<p className="leden_table_row_button" onClick={() => setAddRole(row.id)}>Voeg rol toe</p>)}
                                    {addRole === row.id && (
                                        <form className="add_role" onSubmit={handleSubmit}>
                                            <select>
                                                {roleData.map((item) => {
                                                    return <option>{item.role}</option>;
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
                        {roleData.map((role) => {
                            return <div className="manage_roles_role">
                                <p className="manage_roles_icon" style={{backgroundColor: role.color}}>{role.role} </p>
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
