import api from "@/lib/api";
import { IPassword, IRegister } from "@/types";

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password });
        return response.data.data;
    },

    register: async (data: IRegister) => {
        const response = await api.post("/auth/register", data);
        return response.data.data;
    },

    logout: async () => {
        await api.post("/auth/logout");
    },

    changePassword: async (data: IPassword) => {
        const response = await api.post("/auth/change-password", data);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    },

    resetPassword: async (token: string, newPassword: string) => {
        const response = await api.post("/auth/reset-password", { token, newPassword });
        return response.data;
    }
};
