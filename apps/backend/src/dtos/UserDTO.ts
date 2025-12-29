export interface UserResponseDTO {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    bio?: string;
  };
  createdAt: string;
}
