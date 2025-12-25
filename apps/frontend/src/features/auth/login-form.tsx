"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export function LoginForm() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const { accessToken, user } = await authService.login(values.email, values.password);
            login(accessToken, user);
            toast.success("Login successful");
            router.push("/profile");
        } catch (err: any) {
            if (err.response?.data?.message === "User not verified") {
                toast.error("Please verify your email first.");
                router.push(`/register/verify?email=${encodeURIComponent(values.email)}`);
                return;
            }
            toast.error(err.response?.data?.message || "Something went wrong");
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <a href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" disabled={loading} className="w-full">{loading ? "Logging in..." : "Login"}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
