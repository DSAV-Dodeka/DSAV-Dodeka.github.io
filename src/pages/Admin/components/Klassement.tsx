import React, {useContext, useState, ChangeEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './table.scss';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel
} from '@tanstack/react-table'
import {KlassementList, KlassementData, UserNames} from "../../../functions/api/klassementen";
import AuthContext from "../../Auth/AuthContext";
import "./Klassement.scss";
import {
    queryError, useAdminKlassementQuery, useKlassementQuery,
    useUserNamesQuery
} from "../../../functions/queries";
import {matchNames, MultiMatch, parseFile} from "../functions/parse";
import {back_post_auth} from "../../../functions/api/api";
import SortHeader from "./SortHeader";
import NewEvent from "./NewEvent";
import Modal from "../../../components/Modal/Modal";
import ModalForm from "../../../components/Modal/ModalForm";
import EditKlassement from "./EditKlassement";

const columnHelper = createColumnHelper<KlassementData>()



const defaultIds: UserNames[] = [
    {
        user_id: '1_arnold',
        firstname: 'Arnold',
        lastname: 'het Aardvarken'
    },
    {
        user_id: '2_arnold',
        firstname: 'Arthur',
        lastname: 'het Tweede Aardvarken'
    },
    {
        user_id: '3_arnold',
        firstname: 'Aaron',
        lastname: 'het Derde Aardvarken'
    },
]

const defaultTraining = [
    {
        user_id: '1_arnold',
        firstname: 'Arnold',
        lastname: 'het Aardvarken',
        points: 22
    },
    {
        user_id: '2_arnold',
        firstname: 'Arthur',
        lastname: 'het Tweede Aardvarken',
        points: 12,
    },
    {
        user_id: '3_arnold',
        firstname: 'Aaron',
        lastname: 'het Derde Aardvarken',
        points: 5
    },
]



export interface KlassementProps {
    typeName: "points" | "training"
    addText: string
    headerText: string
    viewEventText: string
}


const Klassement = ({typeName, addText, headerText, viewEventText}: KlassementProps) => {
    const {authState, setAuthState} = useContext(AuthContext);
    const [newEvent, setNewEvent] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    



    const columns = [
        columnHelper.accessor(row => `${row.firstname} ${row.lastname}`, {
            id: 'fullName',
            header: () => 'Naam',
        }),
        columnHelper.accessor('points', {
            header: () => headerText,
        })
    ]

    const q = useAdminKlassementQuery({ authState, setAuthState }, typeName)
    const pointsData = queryError(q, defaultTraining, `Class ${typeName} Query Error`)

    const clearEvent = async () => {
        setNewEvent(false)
        // Refetch so updated values are visible
        await q.refetch()
    }

    const qNames = useUserNamesQuery({ authState, setAuthState })
    const namesData = queryError(qNames, defaultIds, `Names in Class ${typeName} Admin Query Error`)

    const table = useReactTable<KlassementData>({
        data: pointsData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getRowCanExpand: () => true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    })

    const addEventHeader = <th ><p className="leden_table_header_button" onClick={() => setNewEvent(true)}>{addText}</p></th>

    return (
        <div>
            <EditKlassement />
            <table className="leden_table">
                <SortHeader table={table} OtherHeader={addEventHeader} />
                <tbody>
                {table.getRowModel().rows.length === 0 && (
                    <tr>
                        <td colSpan={5}>Er zijn helaas geen leden.</td>
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
                                <p className="leden_table_row_link">{viewEventText}</p>
                            </td>
                        </tr>
                    </Fragment>
                ))}
                </tbody>
            </table>
            <div/><br/>
            {newEvent &&
                <NewEvent namesData={namesData} addText={addText} typeName={typeName} clearEvent={clearEvent} />
            }
        </div>
    )
}

export default Klassement;
