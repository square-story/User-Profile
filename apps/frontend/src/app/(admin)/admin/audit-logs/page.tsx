"use client"

import * as React from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import api from "@/lib/api"
import { parseAsInteger, useQueryState, parseAsString } from "nuqs"

export default function AuditLogsPage() {
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
    const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(20))
    const [action, setAction] = useQueryState("action", parseAsString.withDefault(""))

    const { data, isLoading } = useQuery({
        queryKey: ["audit-logs", page, limit, action],
        queryFn: async () => {
            const res = await api.get(`/admin/audit-logs`, {
                params: { page, limit, action }
            });
            return res.data.data;
        },
        placeholderData: keepPreviousData
    });

    const logs = data?.logs || [];
    const pageCount = data?.pagination.pages || -1;

    const { table } = useDataTable({
        columns,
        data: logs,
        pageCount,
        initialState: {
            pagination: {
                pageSize: limit,
                pageIndex: page - 1
            }
        },
    });

    React.useEffect(() => {
        table.setPageIndex(page - 1)
    }, [page, table])

    React.useEffect(() => {
        table.setPageSize(limit)
    }, [limit, table])

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
            <div className="flex items-center gap-2">
                <input
                    placeholder="Filter by Action..."
                    className="max-w-sm rounded-md border px-3 py-2 text-sm"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                />
            </div>
            <DataTable table={table} className="rounded-md border">
                <DataTablePagination table={table} />
            </DataTable>
        </div>
    )
}
