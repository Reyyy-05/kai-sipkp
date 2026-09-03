"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu, ChevronRight } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
  user: {
    name: string;
    role: string;
  };
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Administrator",
    staff: "Staff",
    pic: "PIC Verifikator",
    management_rep: "Management Rep",
  };
  return labels[role] || role;
}

function getRoleBadgeColor(role: string): string {
  const colors: Record<string, string> = {
    admin: "bg-purple-50 text-purple-700 border-purple-200",
    staff: "bg-blue-50 text-blue-700 border-blue-200",
    pic: "bg-emerald-50 text-emerald-700 border-emerald-200",
    management_rep: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return colors[role] || "bg-zinc-100 text-zinc-700 border-zinc-200";
}

// Build breadcrumbs from pathname
function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    complaints: "Keluhan",
    documents: "Dokumen",
    users: "Pengguna",
    settings: "Pengaturan",
    new: "Baru",
  };

  let currentPath = "";
  for (const seg of segments) {
    currentPath += `/${seg}`;
    const label = labelMap[seg] || (seg.match(/^\d+$/) ? `#${seg}` : seg);
    crumbs.push({ label, href: currentPath });
  }

  return crumbs;
}

export default function Header({
  onMenuToggle,
  user,
}: HeaderProps) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="glass sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-zinc-200/60">
      {/* Left — Mobile menu + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-md text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-all"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1 text-[13px]">
          {breadcrumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="w-3 h-3 text-zinc-400" />
              )}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-zinc-900">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-zinc-100/80 rounded-lg px-3 py-1.5 w-56 focus-within:ring-1 focus-within:ring-blue-500/20 focus-within:bg-white focus-within:border focus-within:border-blue-200 transition-all border border-transparent">
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari..."
            className="bg-transparent text-[12px] outline-none flex-1 placeholder:text-zinc-400"
          />
          <kbd className="hidden lg:inline-flex text-[10px] text-zinc-400 bg-zinc-200/60 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-md text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-zinc-200 mx-1"></div>

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg gradient-kai flex items-center justify-center text-white text-[10px] font-bold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-medium text-zinc-800 leading-tight">
              {user.name}
            </p>
            <span
              className={`inline-flex text-[10px] font-medium px-1.5 py-[1px] rounded border ${getRoleBadgeColor(
                user.role
              )}`}
            >
              {getRoleLabel(user.role)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
