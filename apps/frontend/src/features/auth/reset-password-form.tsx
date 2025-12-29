"use client";
import { getErrorMessage } from "@/lib/error-utils";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isCheckingToken, setIsCheckingToken] = React.useState(true);
    const [isTokenValid, setIsTokenValid] = React.useState(true);

    React.useEffect(() => {
        if (!token) {
            setIsCheckingToken(false);
            setIsTokenValid(false);
            return;
        }

        const verifyToken = () => {
            try {
                toast.promise(
                    authService.validateResetToken(token),
                    {
                        loading: "Verifying reset token...",
                        success: "Reset token verified successfully",
                        error: "Failed to verify reset token",
                    }
                );
                setIsTokenValid(true);
            } catch {
                toast.error("Invalid or expired reset token");
                setIsTokenValid(false);
            } finally {
                setIsCheckingToken(false);
            }
        };
        verifyToken();
    }, [token]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!token) {
            toast.error("Missing reset token. Please restart the process.");
            return;
        }

        try {
            setIsLoading(true);
            toast.promise(
                authService.resetPassword(token, values.password),
                {
                    loading: "Resetting password...",
                    success: "Password reset successfully",
                    error: "Failed to reset password",
                }
            );
            router.push("/login");
        } catch (err: unknown) {
            toast.error(getErrorMessage(err) || "Failed to reset password. Token may be invalid or expired.");
        } finally {
            setIsLoading(false);
        }
    }

    if (isCheckingToken) {
        return (
            <Card className="w-[350px]">
                <CardContent className="pt-6 text-center">
                    <p>Verifying link...</p>
                </CardContent>
            </Card>
        );
    }

    if (!isTokenValid || !token) {
        return (
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle className="text-destructive">Invalid Link</CardTitle>
                    <CardDescription>
                        This password reset link is invalid or has expired.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full" variant="secondary">
                        <Link href="/forgot-password">Request a new link</Link>
                    </Button>
                    <div className="text-center text-sm">
                        <Link href="/login" className="text-primary hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
