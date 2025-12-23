"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        if (isMounted && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isMounted, isAuthenticated, router]);

    // Prevent flash of content or redirects before hydration
    if (!isMounted) {
        return (
            <div className="flex h-screen items-center justify-center space-y-4 flex-col">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-48" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return <>{children}</>;
}
