import api from "@/lib/api";

export const profileService = {
    getProfile: async () => {
        const response = await api.get("/profile");
        return response.data.data;
    },

    updateProfile: async (data: any) => {
        const response = await api.put("/profile", data);
        return response.data.data;
    },

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await api.post("/profile/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    }
};
