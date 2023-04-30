import React, {useContext, useEffect, useReducer, useState, ChangeEvent, FocusEvent, Fragment, FormEvent} from "react";
import {z} from "zod";
import './table.scss';
import Papa from "papaparse";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel
} from '@tanstack/react-table'
import {UserData, ud_request, catch_api, RoleInfo} from "../../../functions/api/api";
import { TrainingsKlassementDataNew, EventType } from "../../../functions/api/klassementen";
import AuthContext from "../../Auth/AuthContext";
import "./Puntenklassement.scss";
import {useQuery, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {queryError, useTrainingsKlassementQueryNew} from "../../../functions/queries";
import EventTypes from "../../../content/EventTypes.json";
import {parseFile} from "./parse";


const columnHelper = createColumnHelper<TrainingsKlassementDataNew>()

const columns = [
    columnHelper.accessor('name', {
        header: () => 'Naam',
    }),
    columnHelper.accessor('points', {
        header: () => 'Aantal trainingen',
    })
]

const defaultData: TrainingsKlassementDataNew[] = [
    {
        user_id: '1_arnold',
        name: 'Arnold het Aardvarken',
        points: 12
    },
    {
        user_id: '2_arnold',
        name: 'Arnold B',
        points: 11
    },
    {
        user_id: '3_arnold',
        name: 'Arnold C',
        points: 10
    },
    {
        user_id: '4_arnold',
        name: 'Arnold D',
        points: 9
    },
    {
        user_id: '5_arnold',
        name: 'Arnold E',
        points: 8
    },
]

const Trainingsklassement = () => {
    const {authState, setAuthState} = useContext(AuthContext);
    const [newEvent, setNewEvent] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [geselecteerdeLeden, setGeselecteerdeLeden] = useState<string[]>([]);
    const [onherkend, setOnherkend] = useState<string[]>([]);
    const [fileUploaded, setFileUploaded] = useState(false);

    const q = useTrainingsKlassementQueryNew({ authState, setAuthState })
    const data = queryError(q, defaultData, "User Info Query Error")

    const table = useReactTable<TrainingsKlassementDataNew>({
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

    const getName = (member: string) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].user_id == member) {
                return data[i].name;
            }
        }
        return null;
    }

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files === null) {
            console.log("Files are null!")
            return
        }

        setFileUploaded(true);

        const rowSchema = z.object({
            user_id: z.string(),
            points: z.coerce.number()
        })

        type Row = z.infer<typeof rowSchema>

        const errCallback = (e: unknown) => {
            console.log(JSON.stringify(e))
        }

        const resultCallback = (found: Row[]) => {
            console.log(JSON.stringify(found))
        }

        parseFile(files, rowSchema, resultCallback, errCallback)
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
                            <th ><p className="leden_table_header_button" onClick={() => setNewEvent(true)}>Voeg trainingen toe</p></th>
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
                            <td>
                                <p className="leden_table_row_link">Bekijk trainingen</p>
                            </td>
                        </tr>
                    </Fragment>
                ))}
                </tbody>
            </table>
            <div/><br/>
            {newEvent && 
                <>
                <div className="new_event_container" />
                <div className="new_event">
                <svg xmlns="http://www.w3.org/2000/svg" className="new_event_cross" onClick={() => {setNewEvent(false); setGeselecteerdeLeden([]); setOnherkend([]); setFileUploaded(false)}} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg>
                    <p className="new_event_title">Voeg trainingen toe</p>
                    <form className="new_event_form">
                        <input className="new_event_input" type="text" placeholder="Omschrijving"></input>
                        <div className="new_event_half">
                            <p className="new_event_label">Datum:</p>
                            <input className="new_event_date" type="date"></input><br/>
                        </div>
                        
                        <p className="new_event_label_type">Upload bestand met punten:</p>
                        <input className="new_event_file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload}></input>
                        {fileUploaded && <div className="new_event_selected">
                            <div className="new_event_half">
                                <p className="new_event_label_members">Geselecteerde leden:</p>
                                <>
                                    {geselecteerdeLeden.map((item) => {
                                        return <p>{item}</p>
                                    })}
                                    {geselecteerdeLeden.length === 0 && <p>Helaas komen geen van de user ids in het bestand overeen met bestaande leden.</p>}
                                </>

                            </div>
                            <div className="new_event_half">
                                <p className="new_event_label_members">Niet herkende user ids:</p>
                                <>
                                    {onherkend.map((item) => {
                                        return <p className="onherkend">{item}</p>
                                    })}
                                    {onherkend.length === 0 && <p>Er zijn geen onherkende user ids.</p>}
                                </>
                                

                            </div>
                        </div>}
                        <button className="leden_table_row_button">Voeg toe</button>
                    </form>

                </div>
                </>
                
            }
        </div>
    )
}

export default Trainingsklassement;
