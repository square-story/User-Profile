import { StatusCode } from "../types";

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const normalizeError = (error: unknown): AppError => {
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof Error) {
        return new AppError(error.message, StatusCode.InternalServerError, false);
    }

    if (typeof error === "string") {
        return new AppError(error, StatusCode.InternalServerError, false);
    }

    return new AppError("Unknown error", StatusCode.InternalServerError, false);
};

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === "string") return error;
    return "Unknown error occurred";
};
