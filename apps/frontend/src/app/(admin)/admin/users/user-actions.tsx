
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MoreHorizontal, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { IUser } from "@/types";
import { useUpdateUser, useDeactivateUser, useReactivateUser } from "@/hooks/use-users";

interface UserActionsProps {
    user: IUser;
}

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    role: z.enum(["admin", "user"]),
});

export function UserActions({ user }: UserActionsProps) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openView, setOpenView] = useState(false);
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const { mutate: deactivateUser, isPending: isDeactivating } = useDeactivateUser();
    const { mutate: reactivateUser, isPending: isReactivating } = useReactivateUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user.profile.firstName,
            lastName: user.profile.lastName,
            role: user.role,
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateUser(
            { id: user.id, data: values },
            {
                onSuccess: () => {
                    setOpenEdit(false);
                },
            }
        );
    };

    const handleToggleStatus = () => {
        if (user.isActive) {
            deactivateUser(user.id);
        } else {
            reactivateUser(user.id);
        }
    };

    const fullName = `${user.profile.firstName} ${user.profile.lastName}`;
    const initials = `${user.profile.firstName?.[0] || ''}${user.profile.lastName?.[0] || ''}`.toUpperCase();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenView(true)}>
                        View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleToggleStatus}
                        className={user.isActive ? "text-red-600" : "text-green-600"}
                        disabled={isDeactivating || isReactivating}
                    >
                        {user.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit User Dialog */}
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Make changes to the user's profile and role here.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
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
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* View User Sheet */}
            <Sheet open={openView} onOpenChange={setOpenView}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>User Details</SheetTitle>
                        <SheetDescription>
                            Detailed information about the selected user.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-8 space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.profile.avatarUrl} alt={fullName} />
                                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h3 className="text-xl font-bold">{fullName}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role}
                            </Badge>
                        </div>

                        <Separator />

                        <div className="space-y-4 p-5">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                <Badge variant={user.isActive ? "outline" : "destructive"}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">User ID</h4>
                                    <p className="text-sm font-mono truncate" title={user.id}>{user.id}</p>
                                </div>
                            </div>

                            {/* Added Bio if available */}
                            {user.profile.bio && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
                                    <p className="text-sm">{user.profile.bio}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
