"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function GuestGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (isMounted && isAuthenticated) {
            router.replace("/profile");
        }
    }, [isMounted, isAuthenticated, router]);

    if (!isMounted) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (isAuthenticated) return null;

    return <>{children}</>;
}
