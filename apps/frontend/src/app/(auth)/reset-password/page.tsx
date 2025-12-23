import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
