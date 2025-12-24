"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import AdminGuard from "@/components/guards/AdminGuard";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileClock, History, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <div className="flex h-screen overflow-hidden bg-background">
                <main className="flex-1 overflow-y-auto bg-muted/10 p-8">
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}

function AdminSidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    const links = [
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/audit-logs", label: "Audit Logs", icon: FileClock },
        // { href: "/admin/login-history", label: "Login History", icon: History }, // Can be sub-page of users or distinct
    ];

    return (
        <aside className="w-64 border-r bg-card shadow-sm">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-primary">
                    <LayoutDashboard className="h-6 w-6" />
                    <span>Admin Panel</span>
                </Link>
            </div>
            <nav className="flex flex-col gap-2 p-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link key={link.href} href={link.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn("w-full justify-start", isActive && "bg-secondary")}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>
            <div className="absolute bottom-4 left-0 w-64 px-4">
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
