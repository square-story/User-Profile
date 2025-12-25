"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notificationService } from "@/services/notification.service";

interface INotification {
    _id: string;
    message: string;
    createdAt: string;
}

export function NotificationList() {
    const [notifications, setNotifications] = React.useState<INotification[]>([]);

    const fetchNotifications = React.useCallback(async () => {
        try {
            const data = await notificationService.getAll();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setNotifications((data as any).data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    React.useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No notifications.</p>
                ) : (
                    <ul className="space-y-2">
                        {notifications.map((notif: INotification) => (
                            <li key={notif._id} className="p-2 border rounded-md text-sm">
                                <p>{notif.message}</p>
                                <span className="text-xs text-muted-foreground">{new Date(notif.createdAt).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
