export enum StatusCode {
  Success = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  RateLimitExceeded = 429,
  TooManyAttempts = 429,
}

export enum StatusMessage {
  USER_NOT_FOUND = "User not found",
  USER_BLOCKED = "Your account has been deactivated. Please contact support.",
  INVALID_DATA = "Invalid credentials",
  ALREADY_VERIFIED = "User already verified",
  EXPERIED_VERIFICATION_CODE = "Invalid or expired verification code",
  TOO_MANY_TRY = "Too many failed attempts. Please request a new code.",
  ALREADY_EXISTED = "User already exists"
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortOptions {
  [key: string]: 1 | -1; // Mongoose sort direction
}

export interface UserQueryParams extends PaginationParams {
  search?: string;
  role?: string;
  status?: string | "active" | "inactive";
  sort?: string | string[]; // Can be string "field:asc" or array of such strings
}

export interface AuditLogQueryParams extends PaginationParams {
  search?: string;
  action?: string;
  userId?: string;
  sort?: string | string[];
}

export interface UpdateUserRequest {
  role?: "admin" | "user" | "moderator";
  isActive?: boolean;
  status?: "active" | "inactive";
  firstName?: string;
  lastName?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResultWithLegacy<T> {
  users?: T[];
  logs?: T[];
  total: number;
  page: number;
  limit: number;
}

export type AppFilterQuery<T> = { [P in keyof T]?: any } & Record<string, any>;
