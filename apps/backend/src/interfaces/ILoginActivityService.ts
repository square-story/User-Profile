export interface ILoginActivityService {
    recordLogin(userId: string, ip: string, userAgent: string): Promise<void>;
}
