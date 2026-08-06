import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { AdminLayoutShell } from "@/features/admin/components/admin-layout-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pertahanan tingkat layout: pastikan user harus log in untuk melihat semua rute /admin/*
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  async function handleLogout() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <AdminLayoutShell 
      adminName={session.user.name ?? "Admin"} 
      onLogout={handleLogout}
    >
      {children}
    </AdminLayoutShell>
  );
}
