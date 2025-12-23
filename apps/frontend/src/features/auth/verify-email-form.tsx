"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const formSchema = z.object({
    pin: z.string().min(6, {
        message: "Your verification code must be 6 characters.",
    }),
});

export function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pin: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!email) {
            toast.error("Email missing. Please register again.");
            return;
        }

        try {
            setIsLoading(true);
            const { accessToken, user } = await authService.verifyEmail(email, values.pin);
            login(accessToken, user);
            toast.success("Email verified successfully!");
            router.push("/profile");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Verification failed. Please check your code.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Verify Email</CardTitle>
                <CardDescription>
                    Enter the code sent to {email ? <span className="font-medium text-foreground">{email}</span> : "your email"}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription>
                                        Please enter the verification code sent to your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
