export interface CreateUserDto {
  email: string;
  passwordHash: string;
  role?: "admin" | "user";
  profile: {
    avatarUrl?: string;
    firstName: string;
    lastName: string;
    bio?: string;
  };
}
