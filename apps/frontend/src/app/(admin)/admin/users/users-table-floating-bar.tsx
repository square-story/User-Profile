
"use client"

import { Table } from "@tanstack/react-table"
import { CheckCircle2, UserX, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useBulkDeactivateUser, useBulkReactivateUser } from "@/hooks/use-users"
import { IUser } from "@/types"

interface UsersTableFloatingBarProps {
    table: Table<IUser>
}

export function UsersTableFloatingBar({ table }: UsersTableFloatingBarProps) {
    const rows = table.getFilteredSelectedRowModel().rows
    const { mutate: bulkDeactivate, isPending: isDeactivating } = useBulkDeactivateUser()
    const { mutate: bulkReactivate, isPending: isReactivating } = useBulkReactivateUser()

    if (rows.length === 0) return null

    const handleDeactivate = () => {
        const ids = rows.map(row => row.original.id)
        bulkDeactivate(ids, {
            onSuccess: () => table.toggleAllRowsSelected(false)
        })
    }

    const handleReactivate = () => {
        const ids = rows.map(row => row.original.id)
        bulkReactivate(ids, {
            onSuccess: () => table.toggleAllRowsSelected(false)
        })
    }

    return (
        <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-2">
            <div className="w-full overflow-x-auto">
                <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
                    <div className="flex h-10 items-center whitespace-nowrap px-2 font-medium">
                        <span className="text-sm text-muted-foreground mr-1">
                            {rows.length}
                        </span>
                        <span className="text-sm">selected</span>
                    </div>

                    <Separator orientation="vertical" className="hidden h-5 sm:block" />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 border"
                            onClick={handleDeactivate}
                            disabled={isDeactivating}
                        >
                            <UserX className="mr-2 h-3.5 w-3.5" />
                            Deactivate
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 border"
                            onClick={handleReactivate}
                            disabled={isReactivating}
                        >
                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                            Activate
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="hidden h-5 sm:block" />

                    <div className="flex items-center p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => table.toggleAllRowsSelected(false)}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear selection</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
