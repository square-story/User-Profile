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
        return <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    }

    if (isAuthenticated) return null;

    return <>{children}</>;
}
