import { RegisterForm } from "@/features/auth/register-form";
import { GuestGuard } from "@/components/guards/guest-guard";

export default function RegisterPage() {
    return (
        <GuestGuard>
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <RegisterForm />
            </div>
        </GuestGuard>
    );
}
