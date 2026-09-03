"use client";

import { useEffect, useState } from "react";
import {
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Types
interface DashboardStats {
  total: number;
  baru: number;
  diproses: number;
  selesai: number;
  ditolak: number;
  perluTindakLanjut: number;
  avgResolutionDays: number;
}

interface MonthlyData {
  month: string;
  total: number;
  resolved: number;
}

interface SourceData {
  name: string;
  value: number;
}

interface RecentComplaint {
  id: number;
  complaintNumber: string;
  reportDate: string;
  customerName: string;
  status: string;
  source: string;
}

const PIE_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

function getStatusBadge(status: string) {
  const config: Record<string, { label: string; color: string }> = {
    baru: { label: "Baru", color: "bg-blue-50 text-blue-700 border-blue-200" },
    diproses: { label: "Diproses", color: "bg-amber-50 text-amber-700 border-amber-200" },
    selesai: { label: "Selesai", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ditolak: { label: "Ditolak", color: "bg-red-50 text-red-700 border-red-200" },
    perlu_tindak_lanjut: { label: "Tindak Lanjut", color: "bg-orange-50 text-orange-700 border-orange-200" },
  };
  const { label, color } = config[status] || { label: status, color: "bg-zinc-100 text-zinc-700" };
  return (
    <span className={`status-badge text-[11px] ${color}`}>{label}</span>
  );
}

// Custom tooltip for Shadcn-style charts
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-lg p-3 text-[12px]">
      <p className="font-medium text-zinc-900 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-zinc-600">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }}></div>
          <span>{entry.name}:</span>
          <span className="font-semibold text-zinc-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [sourceData, setSourceData] = useState<SourceData[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<RecentComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setMonthlyData(data.monthly);
        setSourceData(data.sources);
        setRecentComplaints(data.recent);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      // Use demo data on failure
      setStats({
        total: 7,
        baru: 2,
        diproses: 2,
        selesai: 3,
        ditolak: 0,
        perluTindakLanjut: 0,
        avgResolutionDays: 3.3,
      });
      setMonthlyData([
        { month: "Jul", total: 3, resolved: 2 },
        { month: "Agu", total: 5, resolved: 3 },
        { month: "Sep", total: 2, resolved: 0 },
      ]);
      setSourceData([
        { name: "Via Telepon", value: 3 },
        { name: "Via Email", value: 1 },
        { name: "Langsung", value: 2 },
        { name: "Media Sosial", value: 1 },
      ]);
      setRecentComplaints([
        {
          id: 7,
          complaintNumber: "KAI-202609-00002",
          reportDate: "2026-09-02",
          customerName: "Nn. Dian Permata",
          status: "baru",
          source: "Langsung",
        },
        {
          id: 6,
          complaintNumber: "KAI-202609-00001",
          reportDate: "2026-09-01",
          customerName: "Tn. Bambang Hermawan",
          status: "baru",
          source: "Survey",
        },
        {
          id: 5,
          complaintNumber: "KAI-202608-00005",
          reportDate: "2026-08-22",
          customerName: "PT Logistik Nusantara",
          status: "diproses",
          source: "Telepon",
        },
        {
          id: 4,
          complaintNumber: "KAI-202608-00004",
          reportDate: "2026-08-20",
          customerName: "Ny. Ratna Sari",
          status: "diproses",
          source: "Media Sosial",
        },
        {
          id: 3,
          complaintNumber: "KAI-202608-00003",
          reportDate: "2026-08-15",
          customerName: "Tn. Andi Prasetyo",
          status: "selesai",
          source: "Langsung",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5">
              <div className="animate-shimmer h-4 w-24 rounded mb-3"></div>
              <div className="animate-shimmer h-8 w-16 rounded mb-2"></div>
              <div className="animate-shimmer h-3 w-32 rounded"></div>
            </div>
          ))}
        </div>
        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="animate-shimmer h-64 rounded"></div>
          </div>
          <div className="card p-6">
            <div className="animate-shimmer h-64 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Keluhan",
      value: stats?.total || 0,
      icon: MessageSquareWarning,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+12%",
      trendUp: true,
      desc: "Keseluruhan data",
    },
    {
      label: "Baru",
      value: stats?.baru || 0,
      icon: AlertTriangle,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: "+2",
      trendUp: true,
      desc: "Menunggu tindakan",
    },
    {
      label: "Diproses",
      value: stats?.diproses || 0,
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      trend: "0",
      trendUp: false,
      desc: "Sedang ditangani",
    },
    {
      label: "Selesai",
      value: stats?.selesai || 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "+3",
      trendUp: true,
      desc: "Terverifikasi",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="card p-5 animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[13px] font-medium text-zinc-500">
                  {card.label}
                </p>
                <div
                  className={`p-2 rounded-lg ${card.iconBg} ${card.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-900 tabular-nums">
                {card.value}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {card.trend !== "0" && (
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                    card.trendUp ? "text-emerald-600" : "text-zinc-400"
                  }`}>
                    {card.trendUp ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {card.trend}
                  </span>
                )}
                <span className="text-[11px] text-zinc-400">{card.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Avg resolution + quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-purple-50">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-[12px] text-zinc-500">Rata-rata Penyelesaian</p>
            <p className="text-xl font-bold text-zinc-900 tabular-nums">
              {stats?.avgResolutionDays || 0}{" "}
              <span className="text-[13px] font-normal text-zinc-400">hari</span>
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/complaints/new"
          className="card p-5 flex items-center gap-4 group hover:border-blue-300 transition-all"
        >
          <div className="p-2.5 rounded-lg gradient-kai">
            <MessageSquareWarning className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-zinc-700 group-hover:text-blue-700 transition-colors">
              Tambah Keluhan Baru
            </p>
            <p className="text-[11px] text-zinc-400">Input data keluhan</p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          href="/dashboard/documents"
          className="card p-5 flex items-center gap-4 group hover:border-emerald-300 transition-all"
        >
          <div className="p-2.5 rounded-lg bg-emerald-600">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-zinc-700 group-hover:text-emerald-700 transition-colors">
              Generate Laporan
            </p>
            <p className="text-[11px] text-zinc-400">Cetak PDF dokumen</p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart — Monthly Trends */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[14px] font-semibold text-zinc-900">
                Trend Keluhan Bulanan
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                3 bulan terakhir
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={{ stroke: "#e4e4e7" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                name="Selesai"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#colorResolved)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Source Distribution */}
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="text-[14px] font-semibold text-zinc-900">Sumber Keluhan</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Distribusi sumber</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {sourceData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: "11px" }}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <div className="flex items-center justify-between p-5 pb-0">
          <div>
            <h3 className="text-[14px] font-semibold text-zinc-900">Keluhan Terbaru</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              5 keluhan terakhir
            </p>
          </div>
          <Link
            href="/dashboard/complaints"
            className="text-[12px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group"
          >
            Lihat Semua
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="p-5 pt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>No. Keluhan</th>
                <th>Tanggal</th>
                <th>Pelanggan</th>
                <th>Sumber</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.map((complaint, i) => (
                <tr
                  key={complaint.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <td>
                    <span className="font-mono text-[11px] font-semibold text-blue-600">
                      {complaint.complaintNumber}
                    </span>
                  </td>
                  <td className="text-[13px] text-zinc-500 whitespace-nowrap">
                    {new Date(complaint.reportDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-[13px] font-medium text-zinc-800">
                    {complaint.customerName}
                  </td>
                  <td className="text-[13px] text-zinc-500">{complaint.source}</td>
                  <td>{getStatusBadge(complaint.status)}</td>
                  <td className="text-right">
                    <Link
                      href={`/dashboard/complaints/${complaint.id}`}
                      className="btn btn-secondary btn-sm text-[11px]"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
