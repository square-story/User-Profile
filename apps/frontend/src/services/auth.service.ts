import api from "@/lib/api";
import { IPassword, IRegister } from "@/types";

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password });
        return response.data.data;
    },

    register: async (data: IRegister) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },

    verifyEmail: async (email: string, code: string) => {
        const response = await api.post("/auth/verify-email", { email, code });
        return response.data.data;
    },

    resendVerification: async (email: string) => {
        const response = await api.post("/auth/resend-verification", { email });
        return response.data;
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
    },

    validateResetToken: async (token: string) => {
        const response = await api.get(`/auth/reset-password/validate?token=${token}`);
        return response.data;
    }
};
