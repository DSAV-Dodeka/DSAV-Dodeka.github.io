import {flexRender, type Table} from "@tanstack/react-table";
import React from "react";

interface SortHeaderProps<T> {
    table: Table<T>,
    OtherHeader?: React.ReactNode
}

function SortHeader<T>({table, OtherHeader}: SortHeaderProps<T>) {
    return (
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
                {OtherHeader}
            </tr>
        ))}
        </thead>
    )
}

export default SortHeader;