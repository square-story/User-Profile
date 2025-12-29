import api from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export const notificationService = {
    getAll: async () => {
        const response = await api.get(API_ROUTES.NOTIFICATIONS.BASE);
        return response.data;
    },

    markRead: async (id: string) => {
        await api.patch(`${API_ROUTES.NOTIFICATIONS.BASE}/${id}/read`);
    }
};
