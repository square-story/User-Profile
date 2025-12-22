export interface IUser {
    _id: string;
    email: string;
    role: "admin" | "user";
    profile: {
        firstName: string;
        lastName: string;
        bio?: string;
    };
}

export interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (accessToken: string, user: IUser) => void;
    logout: () => void;
}
