"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareWarning,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Train,
  ChevronsUpDown,
} from "lucide-react";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
    position: string;
  };
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const navSections = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "staff", "pic", "management_rep"],
      },
    ],
  },
  {
    label: "Manajemen",
    items: [
      {
        label: "Keluhan",
        href: "/dashboard/complaints",
        icon: MessageSquareWarning,
        roles: ["admin", "staff", "pic", "management_rep"],
      },
      {
        label: "Dokumen",
        href: "/dashboard/documents",
        icon: FileText,
        roles: ["admin", "staff", "pic", "management_rep"],
      },
    ],
  },
  {
    label: "Sistem",
    items: [
      {
        label: "Pengguna",
        href: "/dashboard/users",
        icon: Users,
        roles: ["admin"],
      },
      {
        label: "Pengaturan",
        href: "/dashboard/settings",
        icon: Settings,
        roles: ["admin"],
      },
    ],
  },
];

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Admin",
    staff: "Staff",
    pic: "PIC",
    management_rep: "Mgmt Rep",
  };
  return labels[role] || role;
}

export default function Sidebar({
  user,
  collapsed,
  onToggle,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`sidebar gradient-sidebar flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{ width: collapsed ? "72px" : "260px" }}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 shrink-0">
          <Train className="w-[18px] h-[18px] text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden flex-1 min-w-0">
            <h1 className="text-white font-semibold text-[13px] leading-tight">
              SI-PKP
            </h1>
            <p className="text-zinc-500 text-[10px] leading-tight truncate">
              Keluhan Pelanggan
            </p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-all"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {navSections.map((section) => {
          const filteredItems = section.items.filter((item) =>
            item.roles.includes(user.role)
          );
          if (filteredItems.length === 0) return null;

          return (
            <div key={section.label} className="mb-1">
              {!collapsed && (
                <p className="sidebar-section-label">{section.label}</p>
              )}
              {filteredItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item ${
                      isActive ? "active" : ""
                    } ${collapsed ? "!justify-center !px-3 !mx-2" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {!collapsed && (
                      <span className="animate-fade-in">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="px-2 py-3 border-t border-white/[0.06]">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors group animate-fade-in">
            <div className="w-8 h-8 rounded-lg gradient-kai text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-zinc-200 text-[12px] font-medium truncate leading-tight">
                {user.name}
              </p>
              <p className="text-zinc-500 text-[10px] truncate leading-tight">
                {getRoleLabel(user.role)} • {user.position || user.email}
              </p>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
          </div>
        ) : null}
        <button
          onClick={onLogout}
          className={`sidebar-nav-item w-full mt-1 hover:!bg-red-500/10 hover:!text-red-400 ${
            collapsed ? "!justify-center !px-3 !mx-2" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
