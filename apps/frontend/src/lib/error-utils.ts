import { AxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.message || error.message || "An unknown error occurred";
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "An unknown error occurred";
};

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    stack?: string;
}
