import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(date: Date | string | null): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    baru: "bg-blue-100 text-blue-800 border-blue-200",
    diproses: "bg-yellow-100 text-yellow-800 border-yellow-200",
    selesai: "bg-green-100 text-green-800 border-green-200",
    ditolak: "bg-red-100 text-red-800 border-red-200",
    perlu_tindak_lanjut: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    baru: "Baru",
    diproses: "Diproses",
    selesai: "Selesai",
    ditolak: "Ditolak",
    perlu_tindak_lanjut: "Perlu Tindak Lanjut",
  };
  return labels[status] || status;
}

export function getDocStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800 border-gray-200",
    waiting_approval: "bg-amber-100 text-amber-800 border-amber-200",
    finalized: "bg-blue-100 text-blue-800 border-blue-200",
    signed: "bg-green-100 text-green-800 border-green-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function getDocStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Draft",
    waiting_approval: "Menunggu Persetujuan",
    finalized: "Final",
    signed: "Ditandatangani",
  };
  return labels[status] || status;
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
