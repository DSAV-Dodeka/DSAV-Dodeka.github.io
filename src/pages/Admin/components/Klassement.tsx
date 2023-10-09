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
    queryError, useKlassementQuery,
    useUserNamesQuery
} from "../../../functions/queries";
import {matchNames, MultiMatch, parseFile} from "../functions/parse";
import {back_post_auth} from "../../../functions/api/api";

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

const defaultTraining: KlassementList = [
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

const rowSchema = z.object({
    name: z.string(),
    points: z.coerce.number()
})

type Row = z.infer<typeof rowSchema>
type Matched = {
    name: string,
    points: number,
    matchedName: string,
    user_id: string
}

export interface KlassementProps {
    typeName: "punten" | "training"
    addText: string
    headerText: string
    viewEventText: string
}


const Klassement = ({typeName, addText, headerText, viewEventText}: KlassementProps) => {
    const {authState, setAuthState} = useContext(AuthContext);
    const [newEvent, setNewEvent] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);

    const [geselecteerdeLeden, setGeselecteerdeLeden] = useState<Matched[]>([]);
    const [multiLeden, setMultiLeden] = useState<MultiMatch<Row>[]>([]);
    const [onherkend, setOnherkend] = useState<Row[]>([]);
    const [duplicateLeden, setDuplicateLeden] = useState<(Row & { num: number })[]>([])
    const [uploadError, setUploadError] = useState("")
    const [fileUploaded, setFileUploaded] = useState(false);

    const columns = [
        columnHelper.accessor(row => `${row.firstname} ${row.lastname}`, {
            id: 'fullName',
            header: () => 'Naam',
        }),
        columnHelper.accessor('points', {
            header: () => headerText,
        })
    ]

    const clearUpload = () => {
        setNewEvent(false);
        setFileUploaded(false);
        setGeselecteerdeLeden([]);
        setOnherkend([]);
        setDuplicateLeden([]);
        setMultiLeden([])
    }

    const q = useKlassementQuery({ authState, setAuthState }, typeName)
    const pointsData = queryError(q, defaultTraining, `Class ${typeName} Query Error`)

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

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files === null || files.length === 0) {
            setFileUploaded(false)
            return
        }

        setFileUploaded(true);

        const errCallback = (e: unknown) => {
            console.log(JSON.stringify(e))
        }

        const resultCallback = (found: Row[]) => {
            const sortedFound = found
                .sort((r1, r2) => r1.name.localeCompare(r2.name))
            const foundLength = sortedFound.length
            const duplicates = sortedFound.filter((v, i, a) => {
                // If i > i we look at the previous value, if they are equal, it is a duplicate
                if (i === 0 && foundLength > 1) {
                    return a[i+1].name === v.name
                } else {
                    return a[i-1].name === v.name
                }
            }).map((v, i) => { return {...v, num: i} })

            if (duplicates.length > 0) {
                setDuplicateLeden(duplicates)
                return
            }
            const { noMatch,  uniqueMatch, multipleMatch} = matchNames(namesData, found)
            setGeselecteerdeLeden(uniqueMatch)
            setMultiLeden(multipleMatch)
            setOnherkend(noMatch)
            setUploadError("")
        }

        parseFile(files, rowSchema, resultCallback, errCallback)
    }

    const submitTraining = async (e: FormEvent) => {
        e.preventDefault()
        if (duplicateLeden.length >  0) {
            setUploadError("Er zijn namen die meerdere keren voorkomen. Maak deze namen eerst uniek (voeg bijvoorbeeld de eerste letter van de achternaam toe).")
            return;
        }
        if (multiLeden.length > 0 || onherkend.length > 0) {
            setUploadError("Er zijn nog niet herkende namen of namen met meerdere mogelijkheden (scroll als ze niet allemaal zichtbaar zijn). Pas het document aan zodat deze er niet meer zijn. Mensen zonder account kunnen niet worden toegevoegd.")
            return;
        }
        setUploadError("")
        const req = {
            "users": geselecteerdeLeden,
            "class_type": typeName,
            'date': '2023-09-21',
            'event_id': 'new_event',
            'category': 'some_category',
            'description': 'Heel leuk'
        }

        await back_post_auth("admin/ranking/update/", req, {authState, setAuthState})
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
                            <th ><p className="leden_table_header_button" onClick={() => setNewEvent(true)}>{addText}</p></th>
                        </tr>
                    ))}
                </thead>
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
                <>
                <div className="new_event_container" />
                    <form className="new_event" onSubmit={submitTraining}>
                        <p className="new_event_title">{addText}</p>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="new_event_cross" onClick={clearUpload} viewBox="0 0 1024 1024" version="1.1"><path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z"/></svg>
                            <input className="new_event_input" type="text" placeholder="Omschrijving"></input>
                            <div className="new_event_half">
                                <p className="new_event_label">Datum:</p>
                                <input className="new_event_date" type="date"></input><br/>
                            </div>

                            <p className="new_event_label_type">Upload bestand met punten:</p>
                            <input className="new_event_file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload}></input>
                        </div>
                        {fileUploaded && duplicateLeden.length > 0 && <div>
                            <div className="new_event_half">
                                <p className="new_event_label_members">Namen komen dubbel voor:</p>
                                <>
                                    {duplicateLeden.map((item) => {
                                        return <p key={`${item.name}_${item.points}_${item.points}`}>{item.name} ({item.points} punten)</p>
                                    })}
                                </>
                                <br />
                            </div>
                        </div>}
                        {fileUploaded && duplicateLeden.length == 0 && <div className="new_event_selected">
                            <div className="new_event_half">
                                <p className="new_event_label_members">Geselecteerde leden:</p>
                                <>
                                    {geselecteerdeLeden.map((item) => {
                                        return <p key={item.name + item.matchedName}>{item.name}: {item.matchedName} (+{item.points} punten)</p>
                                    })}
                                    {geselecteerdeLeden.length === 0 && <p>Helaas komen geen van de leden in het bestand overeen met bestaande leden.</p>}
                                </>

                            </div>
                            <div className="new_event_half">
                                <p className="new_event_label_members">Niet herkende leden:</p>
                                <>
                                    {onherkend.map((item) => {
                                        return <p key={item.name} className="onherkend">'{item.name}' ({item.points} punten)</p>
                                    })}
                                    {onherkend.length === 0 && <p>Er zijn geen onherkende leden.</p>}
                                </>
                            </div>
                            <div className="new_event_half">
                                <p className="new_event_label_members">Niet-unieke namen:</p>
                                <>
                                    {multiLeden.map((item, index) => {
                                        return <p key={item.name + index} className="onherkend">Naam: {item.name} — Mogelijke leden: {item.matchedNames.join(', ')} {
                                        }</p>
                                    })}
                                    {multiLeden.length === 0 && <p>Er zijn geen namen met meerdere mogelijkheden.</p>}
                                </>
                            </div>
                        </div>}
                        {uploadError && <div className="new_event_submit_error">{uploadError}</div>}
                        <button className="leden_table_row_button">Voeg toe</button>
                    </form>

                </>

            }
        </div>
    )
}

export default Klassement;
