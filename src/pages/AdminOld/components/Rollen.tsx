import React, {useContext, useState, type ChangeEvent, Fragment, type FormEvent} from "react";
import './table.scss'

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    type SortingState,
    getSortedRowModel
} from '@tanstack/react-table'
import { type RoleData, back_post_auth} from "../../../functions/api/api";
import AuthContext from "../../Auth/AuthContext";
import "./Rollen.scss";
import {queryError, useUserScopeQuery} from "../../../functions/queries";
import RollenInfo from "../../../content/Rollen.json";
import SortHeader from "./SortHeader";

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

// const handleSubmitRole = (e: FormEvent) => {
//     e.preventDefault()
// }

const columnHelper = createColumnHelper<RoleData>()

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

const Rollen = () => {
    const columns = [
        columnHelper.accessor('name', {
            header: () => 'Naam',
        }),
        columnHelper.accessor('scope', {
            header: () => 'Rollen',
            enableSorting: false,
            cell: info => <div className="role_list">{info.getValue().map(item => <p key={item} className="role_icon" style={{backgroundColor: getColor(item), color: getTextColor(item)}}>{item} <svg xmlns="http://www.w3.org/2000/svg" className="role_delete" onClick={() => handleDeleteRole(item, info.row.original.user_id)} style={{fill: getTextColor(item)}} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg></p>)}</div>
        })
    ]
    const rerender = React.useReducer(() => ({}), {})[1]

    const {authState, setAuthState} = useContext(AuthContext)
    const [addRoleUser, setAddRoleUser] = useState("none");
    const [roleToAdd, setRoleToAdd] = useState(RollenInfo.rollen[0].rol)
    const [manageRoles, setManageRoles] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([{
        id: "name",
        desc: false
    }])

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

    const handleDeleteRole = async (rol: string, user_id: string) => {
        console.log(rol);
        console.log(user_id);
    
        const req = {
            "user_id": user_id,
            "scope": rol
        }
    
        await back_post_auth("admin/scopes/remove/", req, {authState, setAuthState})
    
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
        getSortedRowModel: getSortedRowModel(),
    })

    const emptyHeader = <th />

    return (
        <div>
            <table className="leden_table">
                <SortHeader table={table} OtherHeader={emptyHeader} />
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
                                {addRoleUser !== row.original.user_id && (<p key={row.id+'btn'} className="leden_table_row_button" onClick={() => setAddRoleUser(row.original.user_id)}>Voeg rol toe</p>)}
                                {addRoleUser === row.original.user_id && (
                                    <form className="add_role" onSubmit={handleSubmit}>
                                        <select value={roleToAdd} onChange={handleSelectChange}>
                                            {RollenInfo.rollen.map((item) => {
                                                return <option key={row.id + item.rol}>{item.rol}</option>;
                                            })}
                                        </select>
                                        <button className="leden_table_row_button">Voeg toe</button>
                                    </form>
                                )}
                            </td>
                        </tr>
                    </Fragment>
                ))}
                </tbody>
            </table>
            <div/><br/>
            {/* {manageRoles && 
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
                
            } */}
        </div>
    )
}

export default Rollen;
