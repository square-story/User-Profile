import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, IUser } from "../types";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            login: (accessToken: string, user: IUser) =>
                set({ accessToken, user, isAuthenticated: true }),
            logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
        }),
        {
            name: "auth-storage",
        }
    )
);
