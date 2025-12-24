
export interface UserPayload {
    userId: string;
    email: string;
    role: "admin" | "user" | "moderator";
}
