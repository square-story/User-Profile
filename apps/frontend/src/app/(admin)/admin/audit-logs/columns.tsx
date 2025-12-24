"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { format } from "date-fns"
import { IAuditLog } from "@/types" // Need to define IAuditLog?

// I'll assume IAuditLog needs to be added to types/index.ts or defined locally if small.
// Let's rely on 'any' for now to avoid blocking or update types next.
// Better to update types. I'll add IAuditLog to types/index.ts in parallel.

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "action",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Action" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("action")}</div>,
    },
    {
        accessorKey: "resource",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Resource" />
        ),
        cell: ({ row }) => <div>{row.getValue("resource")}</div>,
    },
    {
        accessorKey: "adminId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Admin" />
        ),
        cell: ({ row }) => {
            const admin = row.original.adminId;
            return (
                <div>
                    {admin?.email || admin}
                </div>
            )
        },
    },
    {
        accessorKey: "details",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Details" />
        ),
        cell: ({ row }) => <div className="max-w-[300px] truncate" title={row.getValue("details")}>{row.getValue("details")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Time" />
        ),
        cell: ({ row }) => {
            return (
                <span className="truncate">
                    {format(new Date(row.getValue("createdAt")), "PP pp")}
                </span>
            )
        },
    },
]
