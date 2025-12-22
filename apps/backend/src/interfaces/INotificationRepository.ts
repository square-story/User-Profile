export interface INotificationRepository {
    create(userId: string, message: string): Promise<any>;
    findByUser(userId: string): Promise<any[]>;
}
