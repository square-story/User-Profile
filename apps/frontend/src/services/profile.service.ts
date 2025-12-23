import api from "@/lib/api";

export const profileService = {
    getProfile: async () => {
        const response = await api.get("/profile");
        return response.data.data;
    },

    updateProfile: async (data: any) => {
        const response = await api.put("/profile", data);
        return response.data.data;
    }
};
