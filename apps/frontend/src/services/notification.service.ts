import api from "@/lib/api";

export const notificationService = {
    getAll: async () => {
        const response = await api.get("/notifications");
        return response.data;
    },

    markRead: async (id: string) => {
        await api.patch(`/notifications/${id}/read`);
    }
};
