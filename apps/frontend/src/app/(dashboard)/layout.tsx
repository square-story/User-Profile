import { AuthGuard } from "@/components/guards/auth-guard";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <AuthGuard>{children}</AuthGuard>;
}
