"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { format } from "date-fns"
import { IUser } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserActions } from "./user-actions"

export const columns: ColumnDef<IUser>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "profile.firstName",
        id: "user",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="User" />
        ),
        cell: ({ row }) => {
            const profile = row.original.profile;
            const fullName = `${profile.firstName} ${profile.lastName}`;
            const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase();

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatarUrl} alt={fullName} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="truncate font-medium">{fullName}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Email" />
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Role" />
        ),
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge variant={role === "admin" ? "default" : "secondary"}>
                    {role}
                </Badge>
            )
        },
        meta: {
            label: "Role",
            variant: "select",
            options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
                { label: "Moderator", value: "moderator" },
            ],
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => {
            const isActive = row.original.isActive;
            const status = isActive ? "Active" : "Inactive";
            return (
                <Badge variant={isActive ? "outline" : "destructive"}>
                    {status}
                </Badge>
            )
        },
        meta: {
            label: "Status",
            variant: "select",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
        filterFn: (row, id, value) => {
            // Custom filter logic if needed, or rely on text match if status is string. 
            // But status is boolean `isActive` in my new schema, mapped to "Active"/"Inactive" string in UI?
            // Or server sends `isActive`.
            const isActive = row.original.isActive;
            const status = isActive ? "active" : "inactive";
            return value.includes(status);
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Created At" />
        ),
        cell: ({ row }) => {
            return (
                <span className="truncate font-medium">
                    {format(new Date(row.getValue("createdAt")), "PPP")}
                </span>
            )
        },
    }, {
        id: "actions",
        cell: ({ row }) => <UserActions user={row.original} />,
        size: 32,
    },
]
