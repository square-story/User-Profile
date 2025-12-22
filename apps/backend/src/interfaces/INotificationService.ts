export interface INotificationService {
    createNotification(userId: string, message: string): Promise<void>;
    getNotifications(userId: string): Promise<any[]>;
}

export interface INotificationRepository {
    create(userId: string, message: string): Promise<any>;
    findByUser(userId: string): Promise<any[]>;
}
