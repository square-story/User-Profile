import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export function useAuth() {
    // Handling hydration mismatch if necessary, but usually standard usage is fine.
    // However, persist middleware might delay rehydration.
    const { user, isAuthenticated } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return {
        user,
        isAuthenticated,
        isLoading: !isHydrated
    };
}
