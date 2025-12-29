import api from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { IPassword, IRegister } from "@/types";

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post(API_ROUTES.AUTH.LOGIN, { email, password });
        return response.data.data;
    },

    register: async (data: IRegister) => {
        const response = await api.post(API_ROUTES.AUTH.REGISTER, data);
        return response.data;
    },

    verifyEmail: async (email: string, code: string) => {
        const response = await api.post(API_ROUTES.AUTH.VERIFY_EMAIL, { email, code });
        return response.data.data;
    },

    resendVerification: async (email: string) => {
        const response = await api.post(API_ROUTES.AUTH.RESEND_VERIFICATION, { email });
        return response.data;
    },

    logout: async () => {
        await api.post(API_ROUTES.AUTH.LOGOUT);
    },

    changePassword: async (data: IPassword) => {
        const response = await api.post(API_ROUTES.AUTH.CHANGE_PASSWORD, data);
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    },

    resetPassword: async (token: string, newPassword: string) => {
        const response = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, { token, newPassword });
        return response.data;
    },

    validateResetToken: async (token: string) => {
        const response = await api.get(`${API_ROUTES.AUTH.VALIDATE_RESET_TOKEN}?token=${token}`);
        return response.data;
    }
};
