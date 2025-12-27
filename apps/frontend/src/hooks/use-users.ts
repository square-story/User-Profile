
import { useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/error-utils";
import { IUser } from "@/types";
import { toast } from "sonner";

interface UpdateUserData {
    firstName: string;
    lastName: string;
    role: "admin" | "user";
}

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateUserData }) => {
            const res = await api.put<{ success: boolean; data: IUser }>(`/admin/users/${id}`, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User updated successfully");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error) || "Failed to update user");
        },
    });
}

// Helper to update user status in cache
const updateUserStatusInCache = (queryClient: QueryClient, userIds: string[], isActive: boolean) => {
    queryClient.setQueriesData({ queryKey: ["users"] }, (oldData: { users: IUser[] } | IUser[] | undefined) => {
        if (!oldData) return oldData;
        // If data structure is { users: [...], total: ... }
        if ("users" in oldData) {
            return {
                ...oldData,
                users: oldData.users.map((user: IUser) =>
                    userIds.includes(user.id) ? { ...user, isActive } : user
                )
            };
        }
        // If data structure is just array (unlikely given pagination)
        if (Array.isArray(oldData)) {
            return oldData.map((user: IUser) =>
                userIds.includes(user.id) ? { ...user, isActive } : user
            );
        }
        return oldData;
    });
};

export function useDeactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/admin/users/${id}/deactivate`);
            return res.data;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });
            const previousData = queryClient.getQueryData(["users"]);
            updateUserStatusInCache(queryClient, [id], false);
            return { previousData };
        },
        onError: (error, _, context: any) => {
            if (context?.previousData) {
                queryClient.setQueryData(["users"], context.previousData);
            }
            toast.error(getErrorMessage(error) || "Failed to deactivate user");
        },
        onSuccess: () => {
            toast.success("User deactivated successfully");
        },
    });
}

export function useReactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/admin/users/${id}/reactivate`);
            return res.data;
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });
            const previousData = queryClient.getQueryData(["users"]);
            updateUserStatusInCache(queryClient, [id], true);
            return { previousData };
        },
        onError: (error, _, context: any) => {
            if (context?.previousData) {
                queryClient.setQueryData(["users"], context.previousData);
            }
            toast.error(getErrorMessage(error) || "Failed to reactivate user");
        },
        onSuccess: () => {
            toast.success("User reactivated successfully");
        },
    });
}

export function useBulkDeactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userIds: string[]) => {
            const res = await api.post(`/admin/users/bulk-deactivate`, { userIds });
            return res.data;
        },
        onMutate: async (userIds) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });
            const previousData = queryClient.getQueryData(["users"]);
            updateUserStatusInCache(queryClient, userIds, false);
            return { previousData };
        },
        onError: (error, _, context: any) => {
            if (context?.previousData) {
                queryClient.setQueryData(["users"], context.previousData);
            }
            toast.error(getErrorMessage(error) || "Failed to deactivate users");
        },
        onSuccess: () => {
            toast.success("Users deactivated successfully");
        },
    });
}

export function useBulkReactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userIds: string[]) => {
            const res = await api.post(`/admin/users/bulk-reactivate`, { userIds });
            return res.data;
        },
        onMutate: async (userIds) => {
            await queryClient.cancelQueries({ queryKey: ["users"] });
            const previousData = queryClient.getQueryData(["users"]);
            updateUserStatusInCache(queryClient, userIds, true);
            return { previousData };
        },
        onError: (error, _, context: any) => {
            if (context?.previousData) {
                queryClient.setQueryData(["users"], context.previousData);
            }
            toast.error(getErrorMessage(error) || "Failed to reactivate users");
        },
        onSuccess: () => {
            toast.success("Users reactivated successfully");
        },
    });
}
