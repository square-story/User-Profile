"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

    if (!profile) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="notifications">Alerts</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">First Name</p>
                                    <p className="text-lg">{profile.firstName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                                    <p className="text-lg">{profile.lastName}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Bio</p>
                                    <p className="text-lg">{profile.bio || "No bio set"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="edit">
                    <EditProfileForm initialData={profile} onUpdate={fetchProfile} />
                </TabsContent>
                <TabsContent value="notifications">
                    <NotificationList />
                </TabsContent>
                <TabsContent value="security">
                    <ChangePasswordForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
