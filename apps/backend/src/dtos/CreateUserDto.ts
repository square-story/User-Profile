export interface CreateUserDto {
    email: string;
    passwordHash: string;
    role?: "admin" | "user";
    profile: {
        firstName: string;
        lastName: string;
        bio?: string;
    };
}
