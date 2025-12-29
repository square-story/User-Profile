import api from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

export const profileService = {
    getProfile: async () => {
        const response = await api.get(API_ROUTES.PROFILE.BASE);
        return response.data.data;
    },

    updateProfile: async (data: { firstName: string; lastName: string; bio?: string }) => {
        const response = await api.put(API_ROUTES.PROFILE.BASE, data);
        return response.data.data;
    },

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await api.post(API_ROUTES.PROFILE.AVATAR, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    }
};
