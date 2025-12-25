"use client"


import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { useDataTable } from "@/hooks/use-data-table"
import api from "@/lib/api"
import { parseAsInteger, useQueryState, parseAsString } from "nuqs"
import { getSortingStateParser, getFiltersStateParser } from "@/lib/parsers"
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar"
import { DataTableSortList } from "@/components/data-table/data-table-sort-list"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { Input } from "@/components/ui/input"
import { UsersTableFloatingBar } from "./users-table-floating-bar"
import { useDebounce } from "@/hooks/use-debounce"

export default function UsersPage() {
    // URL State
    const [page] = useQueryState("page", parseAsInteger.withDefault(1))
    const [perPage] = useQueryState("perPage", parseAsInteger.withDefault(10))

    // Advanced Filters & Sorting
    const [sorting] = useQueryState("sort", getSortingStateParser(columns.map(c => c.id as string).filter(Boolean)).withDefault([]))
    const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
    const [filters] = useQueryState("filters", getFiltersStateParser(columns.map(c => c.id as string).filter(Boolean)).withDefault([]))

    // Debounced Search State
    const debouncedSearch = useDebounce(search, 500)

    // Fetch Data
    const { data, isLoading } = useQuery({
        queryKey: ["users", page, perPage, debouncedSearch, sorting, filters],
        queryFn: async () => {
            // Map sorting state to backend params
            const sortParam = sorting?.map(s => `${s.id}:${s.desc ? "desc" : "asc"}`).join(",");

            // Map filters state to backend params
            const roleFilter = filters.find(f => f.id === "role");
            const statusFilter = filters.find(f => f.id === "status");

            const role = roleFilter ? (Array.isArray(roleFilter.value) ? roleFilter.value[0] : roleFilter.value) : undefined;
            const status = statusFilter ? (Array.isArray(statusFilter.value) ? statusFilter.value[0] : statusFilter.value) : undefined;

            const res = await api.get(`/admin/users`, {
                params: {
                    page,
                    limit: perPage,
                    search,
                    sort: sortParam,
                    role,
                    status
                }
            });
            return res.data.data;
        },
        placeholderData: keepPreviousData
    });

    const users = data?.users || [];
    const pageCount = data?.pagination.pages || -1;

    const { table } = useDataTable({
        columns,
        data: users,
        pageCount,
        initialState: {
            pagination: {
                pageSize: perPage,
                pageIndex: page - 1
            },
            sorting
        },
        enableAdvancedFilter: false,
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            </div>

            {isLoading ? (
                <DataTableSkeleton
                    columnCount={5}
                    rowCount={10}
                    filterCount={2}
                    withViewOptions={false}
                    withPagination={true}
                />
            ) : (
                <DataTable
                    table={table}
                    className="border rounded-md p-4"
                    actionBar={<UsersTableFloatingBar table={table} />}
                >
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
