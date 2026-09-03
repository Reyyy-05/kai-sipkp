"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Monitoring keluhan pelanggan",
  },
  "/dashboard/complaints": {
    title: "Daftar Keluhan",
    subtitle: "Pengelolaan keluhan pelanggan",
  },
  "/dashboard/complaints/new": {
    title: "Tambah Keluhan Baru",
    subtitle: "Input data keluhan pelanggan",
  },
  "/dashboard/documents": {
    title: "Dokumen",
    subtitle: "Manajemen dokumen laporan",
  },
  "/dashboard/users": {
    title: "Pengguna",
    subtitle: "Manajemen akun pengguna",
  },
  "/dashboard/settings": {
    title: "Pengaturan",
    subtitle: "Konfigurasi sistem",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user || {
    name: "Loading...",
    email: "",
    role: "staff",
    position: "",
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Get current page title
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/dashboard";
  const pageInfo = pageTitles[currentPath] || {
    title: "SI-PKP",
    subtitle: "",
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <Sidebar
        user={{
          name: user.name || "User",
          email: user.email || "",
          role: (user as Record<string, unknown>).role as string || "staff",
          position: (user as Record<string, unknown>).position as string || "",
        }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className="main-content transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? "72px" : "260px",
        }}
      >
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          user={{
            name: user.name || "User",
            role: (user as Record<string, unknown>).role as string || "staff",
          }}
        />

        {/* Page Content */}
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
