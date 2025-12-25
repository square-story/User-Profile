import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export function useAuth() {
    // Handling hydration mismatch if necessary, but usually standard usage is fine.
    // However, persist middleware might delay rehydration.
    const { user, isAuthenticated } = useAuthStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true);
    }, []);

    return {
        user,
        isAuthenticated,
        isLoading: !isHydrated
    };
}
