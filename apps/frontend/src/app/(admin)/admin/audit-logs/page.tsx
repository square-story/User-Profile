"use client"

import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { useDataTable } from "@/hooks/use-data-table"
import api from "@/lib/api"
import { parseAsInteger, useQueryState, parseAsString } from "nuqs"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar"
import { Input } from "@/components/ui/input"
import { DataTableSortList } from "@/components/data-table/data-table-sort-list"
import { useDebounce } from "@/hooks/use-debounce"
import { getSortingStateParser } from "@/lib/parsers"
import { IAuditLog } from "@/types"

export default function AuditLogsPage() {
    const [page] = useQueryState("page", parseAsInteger.withDefault(1))
    const [limit] = useQueryState("limit", parseAsInteger.withDefault(20))
    const [action] = useQueryState("action", parseAsString.withDefault(""))
    const [search, setSearch] = useQueryState("search", parseAsString.withDefault("").withOptions({ throttleMs: 500 }))
    const [sorting] = useQueryState("sort", getSortingStateParser<IAuditLog>().withDefault([{ id: "createdAt", desc: true }]));
    const debounceSearch = useDebounce(search, 500)

    const { data, isLoading } = useQuery({
        queryKey: ["audit-logs", page, limit, action, debounceSearch, sorting],
        queryFn: async () => {
            const sortParam = sorting.map(s => `${s.id}:${s.desc ? "desc" : "asc"}`).join(",");
            const res = await api.get(`/admin/audit-logs`, {
                params: {
                    page,
                    limit,
                    action,
                    search: debounceSearch,
                    sort: sortParam
                }
            });
            console.log(res.data.data);
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
        queryKeys: {
            perPage: "limit"
        },
        initialState: {
            pagination: {
                pageSize: limit,
                pageIndex: page - 1
            },
            sorting
        },
    });

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
                            <DataTableSortList table={table} />
                        </div>
                    </DataTableAdvancedToolbar>
                </DataTable>
            )}
        </div>
    )
}
