export interface IUser {
    id: string;
    email: string;
    role: "admin" | "user";
    isActive?: boolean;
    profile: {
        avatarUrl?: string;
        firstName: string;
        lastName: string;
        bio?: string;
    };
}

export interface IRegister {
    email: string;
    passwordHash: string;
    profile: {
        firstName: string;
        lastName: string;
    };
}

export interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (accessToken: string, user: IUser) => void;
    logout: () => void;
}

export interface IPassword {
    currentPassword: string;
    newPassword: string;
}

export interface IAuditLog {
    _id: string;
    action: string;
    adminId: IUser | string;
    resource: string;
    targetUserId?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: string;
    createdAt: string;
}

export interface ILoginHistory {
    _id: string;
    userId: string;
    ipAddress: string;
    deviceInfo?: string;
    sessionDuration?: number;
    loginAt: string;
}

