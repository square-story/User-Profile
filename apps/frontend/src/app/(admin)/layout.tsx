"use client";


import AdminGuard from "@/components/guards/AdminGuard";

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
