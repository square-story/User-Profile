"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { EditProfileForm } from "@/features/profile/edit-profile-form";
import { NotificationList } from "@/features/notifications/notification-list";
import { IPassword } from "@/types";
import ChangePasswordForm from "@/features/change-password/change-password-form";
import { profileService } from "@/services/profile.service";
import { authService } from "@/services/auth.service";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [profile, setProfile] = React.useState<any>(null);
    const [password, setPassword] = React.useState<IPassword>({
        currentPassword: "",
        newPassword: ""
    });

    const fetchProfile = React.useCallback(async () => {
        if (!user) return;
        try {
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (err) {
            console.error(err);
        }
    }, [user]);

    React.useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
            router.push("/login");
        } catch (err) {
            console.error(err);
        }
    };

    if (!profile) return <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

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
                <div>
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
