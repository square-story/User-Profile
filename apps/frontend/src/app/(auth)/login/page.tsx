import { LoginForm } from "@/features/auth/login-form";
import { GuestGuard } from "@/components/guards/guest-guard";

export default function LoginPage() {
    return (
        <GuestGuard>
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <LoginForm />
            </div>
        </GuestGuard>
    );
}
