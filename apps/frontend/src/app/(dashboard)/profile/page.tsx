"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { EditProfileForm } from "@/features/profile/edit-profile-form";
import { NotificationList } from "@/features/notifications/notification-list";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [profile, setProfile] = React.useState<any>(null);

    const fetchProfile = React.useCallback(() => {
        if (!user) return;
        api.get("/profile")
            .then((res) => setProfile(res.data.data))
            .catch((err) => console.error(err));
    }, [user]);

    React.useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            logout();
            router.push("/login");
        } catch (err) {
            console.error(err);
        }
    };

    if (!profile) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Profile</h1>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
                            <p><strong>Bio:</strong> {profile.bio || "No bio set"}</p>
                        </CardContent>
                    </Card>

                    <EditProfileForm initialData={profile} onUpdate={fetchProfile} />
                </div>

                <div>
                    <NotificationList />
                </div>
            </div>
        </div>
    );
}
