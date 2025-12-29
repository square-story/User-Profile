export const API_ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        VERIFY_EMAIL: "/auth/verify-email",
        RESEND_VERIFICATION: "/auth/resend-verification",
        LOGOUT: "/auth/logout",
        CHANGE_PASSWORD: "/auth/change-password",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
        VALIDATE_RESET_TOKEN: "/auth/reset-password/validate",
        REFRESH: "/auth/refresh",
    },
    PROFILE: {
        BASE: "/profile",
        AVATAR: "/profile/avatar",
    },
    NOTIFICATIONS: {
        BASE: "/notifications",
    },
} as const;
