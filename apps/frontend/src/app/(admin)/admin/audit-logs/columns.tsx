"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { format } from "date-fns"
import { IAuditLog, IUser } from "@/types"

export const columns: ColumnDef<IAuditLog>[] = [
    {
        accessorKey: "action",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Action" />
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("action")}</div>,
        enableSorting: true,
    },
    {
        accessorKey: "profile.firstName",
        id: "user",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="User" />
        ),
        cell: ({ row }) => {
            const profile = (row.original.adminId as IUser)?.profile;
            const fullName = `${profile.firstName} ${profile.lastName}`;

            return (
                <span className="truncate font-medium">{fullName}</span>
            )
        },
    },
    {
        accessorKey: "resource",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Resource" />
        ),
        cell: ({ row }) => <div>{row.getValue("resource")}</div>,
        enableSorting: true,
    },
    {
        accessorKey: "adminId",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Admin" />
        ),
        cell: ({ row }) => {
            const admin = row.original.adminId;
            return (
                <span className="truncate font-medium">{(admin as IUser)?.email || "Not Available"}</span>
            )
        },
        enableSorting: false, // Disabling as per simple backend implementation
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
                <span className="truncate font-medium">
                    {format(new Date(row.getValue("createdAt")), "PP pp")}
                </span>
            )
        },
        enableSorting: true,
    },
]
