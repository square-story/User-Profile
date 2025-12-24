
import { IUser } from "../models/User";
import { UserResponseDTO } from "../dtos/UserDTO";

export class UserMapper {
    public static toDTO(user: IUser): UserResponseDTO {
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
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
        };
    }

    public static toDTOs(users: IUser[]): UserResponseDTO[] {
        return users.map(user => UserMapper.toDTO(user));
    }
}
