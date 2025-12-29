"use client";
import { getErrorMessage } from "@/lib/error-utils";

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
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
});

export function RegisterForm() {
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setError(null);
        setLoading(true);
        try {
            const payload = {
                email: values.email,
                passwordHash: values.password,
                profile: {
                    firstName: values.firstName,
                    lastName: values.lastName
                }
            };

            toast.promise(
                authService.register(payload),
                {
                    loading: "Registering...",
                    success: "Registered successfully",
                    error: "Failed to register",
                }
            );
            router.push(`/register/verify?email=${encodeURIComponent(values.email)}`);
        } catch (err: unknown) {
            const message = getErrorMessage(err);
            console.error(err);
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create a new account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" disabled={loading} className="w-full">{loading ? "Registering..." : "Register"}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
