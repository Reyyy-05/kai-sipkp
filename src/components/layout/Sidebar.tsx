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

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "staff", "pic", "management_rep"],
  },
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
];

export default function Sidebar({
  user,
  collapsed,
  onToggle,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <aside
      className={`sidebar gradient-sidebar flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
      style={{ width: collapsed ? "72px" : "260px" }}
    >
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 shrink-0">
          <Train className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-white font-bold text-sm leading-tight">
              SI-PKP
            </h1>
            <p className="text-slate-400 text-[10px] leading-tight">
              Keluhan Pelanggan
            </p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all"
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
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item relative ${
                isActive ? "active" : ""
              } ${collapsed ? "justify-center px-3" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="animate-fade-in">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="px-3 py-4 border-t border-white/10">
        {!collapsed && (
          <div className="px-3 mb-3 animate-fade-in">
            <p className="text-white text-sm font-medium truncate">
              {user.name}
            </p>
            <p className="text-slate-400 text-xs truncate">{user.position}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          className={`sidebar-nav-item w-full hover:!bg-red-500/20 hover:!text-red-400 ${
            collapsed ? "justify-center px-3" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
