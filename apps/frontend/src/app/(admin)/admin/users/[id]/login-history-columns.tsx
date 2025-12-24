"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { format } from "date-fns"

export const loginHistoryColumns: ColumnDef<any>[] = [
    {
        accessorKey: "loginAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Login Time" />
        ),
        cell: ({ row }) => format(new Date(row.getValue("loginAt")), "PPP pp"),
    },
    {
        accessorKey: "ipAddress",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="IP Address" />
        ),
    },
    {
        accessorKey: "deviceInfo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Device" />
        ),
    },
    {
        accessorKey: "sessionDuration",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Session Duration" />
        ),
        cell: ({ row }) => {
            const duration = row.getValue("sessionDuration") as number;
            if (!duration) return "Active/Unknown";
            return `${Math.floor(duration / 60)} mins`;
        },
    },
]
