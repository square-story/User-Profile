import { VerifyEmailForm } from "@/features/auth/verify-email-form";
import { Suspense } from "react";

export default function VerifyEmailPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyEmailForm />
            </Suspense>
        </div>
    );
}
