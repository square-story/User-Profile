"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

export function NotificationList() {
    const [notifications, setNotifications] = React.useState<any[]>([]);

    React.useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

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
                        {notifications.map((notif: any) => (
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
