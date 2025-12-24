
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
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
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update user");
        },
    });
}

export function useDeactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post(`/admin/users/${id}/deactivate`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User deactivated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to deactivate user");
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User reactivated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to reactivate user");
        },
    });
}
