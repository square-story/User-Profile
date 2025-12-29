import type { UserResponseDTO } from "../dtos/UserDTO";
import type { IUser } from "../models/User";

export function toDTO(user: IUser): UserResponseDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    profile: {
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      avatarUrl: user.profile.avatarUrl,
      bio: user.profile.bio,
    },
    createdAt: user.createdAt
      ? new Date(user.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

export function toDTOs(users: IUser[]): UserResponseDTO[] {
  return users.map((user) => toDTO(user));
}
