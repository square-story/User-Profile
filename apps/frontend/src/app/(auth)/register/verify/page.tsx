import { VerifyEmailForm } from "@/features/auth/verify-email-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Suspense fallback={<Loader2 className="animate-spin" size={24} />}>
                <VerifyEmailForm />
            </Suspense>
        </div>
    );
}
