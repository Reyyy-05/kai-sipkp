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
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
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
    baru: { label: "Baru", color: "bg-blue-100 text-blue-700 border-blue-200" },
    diproses: { label: "Diproses", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    selesai: { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200" },
    ditolak: { label: "Ditolak", color: "bg-red-100 text-red-700 border-red-200" },
    perlu_tindak_lanjut: { label: "Tindak Lanjut", color: "bg-orange-100 text-orange-700 border-orange-200" },
  };
  const { label, color } = config[status] || { label: status, color: "bg-gray-100 text-gray-700" };
  return (
    <span className={`status-badge text-[11px] ${color}`}>{label}</span>
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
      color: "stat-card-blue",
      iconColor: "text-blue-600",
      desc: "Keseluruhan data",
    },
    {
      label: "Baru",
      value: stats?.baru || 0,
      icon: AlertTriangle,
      color: "stat-card-yellow",
      iconColor: "text-yellow-600",
      desc: "Menunggu tindakan",
    },
    {
      label: "Diproses",
      value: stats?.diproses || 0,
      icon: Clock,
      color: "stat-card-orange",
      iconColor: "text-orange-600",
      desc: "Sedang ditangani",
    },
    {
      label: "Selesai",
      value: stats?.selesai || 0,
      icon: CheckCircle2,
      color: "stat-card-green",
      iconColor: "text-green-600",
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
              className={`card ${card.color} p-5 animate-fade-in`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    {card.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
                </div>
                <div
                  className={`p-2.5 rounded-xl bg-white/60 ${card.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Avg resolution + quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Rata-rata Penyelesaian</p>
            <p className="text-2xl font-bold text-slate-800">
              {stats?.avgResolutionDays || 0}{" "}
              <span className="text-sm font-normal text-slate-500">hari</span>
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/complaints/new"
          className="card p-5 flex items-center gap-4 group hover:border-blue-300 transition-all"
        >
          <div className="p-3 rounded-xl gradient-kai">
            <MessageSquareWarning className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
              Tambah Keluhan Baru
            </p>
            <p className="text-xs text-slate-500">Input data keluhan</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/dashboard/documents"
          className="card p-5 flex items-center gap-4 group hover:border-green-300 transition-all"
        >
          <div className="p-3 rounded-xl bg-green-600">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 group-hover:text-green-700 transition-colors">
              Generate Laporan
            </p>
            <p className="text-xs text-slate-500">Cetak PDF dokumen</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart — Monthly Trends */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-800">
                Trend Keluhan Bulanan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                3 bulan terakhir
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
              <Bar
                dataKey="total"
                name="Total"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="resolved"
                name="Selesai"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Source Distribution */}
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-800">Sumber Keluhan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribusi sumber</p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
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
                iconSize={8}
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h3 className="font-semibold text-slate-800">Keluhan Terbaru</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5 keluhan terakhir
            </p>
          </div>
          <Link
            href="/dashboard/complaints"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group"
          >
            Lihat Semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="p-6 pt-4">
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
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td>
                    <span className="font-mono text-xs font-semibold text-blue-600">
                      {complaint.complaintNumber}
                    </span>
                  </td>
                  <td className="text-sm">
                    {new Date(complaint.reportDate).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="text-sm font-medium">
                    {complaint.customerName}
                  </td>
                  <td className="text-sm text-slate-500">{complaint.source}</td>
                  <td>{getStatusBadge(complaint.status)}</td>
                  <td className="text-right">
                    <Link
                      href={`/dashboard/complaints/${complaint.id}`}
                      className="btn btn-sm btn-secondary text-xs"
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
