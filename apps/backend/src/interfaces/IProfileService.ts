export interface IProfileService {
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, data: any): Promise<any>;
}
