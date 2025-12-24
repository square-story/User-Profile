"use client"

import * as React from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import api from "@/lib/api"
import { parseAsInteger, useQueryState, parseAsString } from "nuqs"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar"
import { Input } from "@/components/ui/input"
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list"
import { DataTableSortList } from "@/components/data-table/data-table-sort-list"

export default function AuditLogsPage() {
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
    const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(20))
    const [action, setAction] = useQueryState("action", parseAsString.withDefault(""))
    const [search, setSearch] = useQueryState("search", parseAsString.withDefault("").withOptions({ throttleMs: 500 }))

    const { data, isLoading } = useQuery({
        queryKey: ["audit-logs", page, limit, action, search],
        queryFn: async () => {
            const res = await api.get(`/admin/audit-logs`, {
                params: { page, limit, action, search }
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
            {isLoading ? (
                <DataTableSkeleton
                    columnCount={5}
                    rowCount={10}
                    filterCount={2}
                    withViewOptions={false}
                    withPagination={true}
                />
            ) : (
                <DataTable table={table} className="border rounded-md p-4">
                    <DataTableAdvancedToolbar table={table} className="p-4 border-b">
                        <div className="flex items-center gap-2">
                            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            <DataTableFilterList table={table} />
                            <DataTableSortList table={table} />
                        </div>
                    </DataTableAdvancedToolbar>
                </DataTable>
            )}
        </div>
    )
}
