"use client";

import { Bell, Search, Menu } from "lucide-react";

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
    admin: "bg-purple-100 text-purple-700",
    staff: "bg-blue-100 text-blue-700",
    pic: "bg-green-100 text-green-700",
    management_rep: "bg-amber-100 text-amber-700",
  };
  return colors[role] || "bg-gray-100 text-gray-700";
}

export default function Header({
  title,
  subtitle,
  onMenuToggle,
  user,
}: HeaderProps) {
  return (
    <header className="glass sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-slate-200/60">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-500 -mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white focus-within:border focus-within:border-blue-200 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari keluhan..."
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full gradient-kai flex items-center justify-center text-white text-xs font-bold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              {user.name}
            </p>
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${getRoleBadgeColor(
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
