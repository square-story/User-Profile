"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table/data-table"
import { loginHistoryColumns } from "./login-history-columns"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const queryClient = useQueryClient();

    // Fetch User Details
    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ["user", id],
        queryFn: async () => {
            const res = await api.get(`/admin/users/${id}`);
            return res.data.data;
        }
    });

    // Fetch Login History
    const { data: history = [] } = useQuery({
        queryKey: ["user-history", id],
        queryFn: async () => {
            const res = await api.get(`/admin/users/${id}/history`);
            return res.data.data;
        }
    });

    // Deactivate/Reactivate Mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ action }: { action: "deactivate" | "reactivate" }) => {
            const res = await api.post(`/admin/users/${id}/${action}`);
            return res.data;
        },
        onSuccess: (data, variables) => {
            toast.success(`User ${variables.action}d successfully`);
            queryClient.invalidateQueries({ queryKey: ["user", id] });
        },
        onError: () => {
            toast.error("Failed to update user status");
        }
    });

    const { table } = useDataTable({
        columns: loginHistoryColumns,
        data: history,
        pageCount: -1, // Client side pagination for history is fine for now
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0
            }
        },
    });

    if (isLoadingUser) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>
    }

    if (!user) {
        return <div>User not found</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{user.profile.firstName} {user.profile.lastName}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                        <Badge variant={user.isActive ? "outline" : "destructive"}>{user.isActive ? "Active" : "Inactive"}</Badge>
                        {user.isActive ? (
                            <Button
                                variant="destructive"
                                onClick={() => updateStatusMutation.mutate({ action: "deactivate" })}
                                disabled={updateStatusMutation.isPending}
                            >
                                Deactivate User
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => updateStatusMutation.mutate({ action: "reactivate" })}
                                disabled={updateStatusMutation.isPending}
                            >
                                Reactivate User
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-1 text-sm">
                            <span className="font-medium text-muted-foreground">ID:</span> <span>{user.id}</span>
                            <span className="font-medium text-muted-foreground">Email:</span> <span>{user.email}</span>
                            <span className="font-medium text-muted-foreground">Role:</span> <span className="capitalize">{user.role}</span>
                            <span className="font-medium text-muted-foreground">Created At:</span> <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Login History</h2>
                <DataTable table={table} className="rounded-md border">
                    <DataTablePagination table={table} />
                </DataTable>
            </div>
        </div>
    )
}
