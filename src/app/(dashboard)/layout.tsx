"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { AuthProvider } from "@/lib/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-screen pb-14 md:pb-0">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
