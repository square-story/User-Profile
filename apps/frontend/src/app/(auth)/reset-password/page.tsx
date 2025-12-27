import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Suspense fallback={<Loader2 className="animate-spin" size={24} />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
