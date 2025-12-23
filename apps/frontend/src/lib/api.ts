import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log("Refreshing token...");
            try {
                const { data } = await api.post("/auth/refresh");
                const newAccessToken = data.data.accessToken;

                // Update store with new token
                useAuthStore.setState({ accessToken: newAccessToken });

                // Update header for original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout(); // Logout on refresh fail
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
