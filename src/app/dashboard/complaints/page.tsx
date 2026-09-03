"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  X,
  Loader2,
  Upload,
  Download,
} from "lucide-react";

interface Complaint {
  id: number;
  complaintNumber: string;
  reportDate: string;
  customerName: string;
  description: string;
  correctiveAction: string | null;
  status: string;
  source: { id: number; label: string };
  pic: { id: number; name: string } | null;
  createdBy: { id: number; name: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    baru: { label: "Baru", color: "bg-blue-50 text-blue-700 border-blue-200" },
    diproses: { label: "Diproses", color: "bg-amber-50 text-amber-700 border-amber-200" },
    selesai: { label: "Selesai", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    ditolak: { label: "Ditolak", color: "bg-red-50 text-red-700 border-red-200" },
    perlu_tindak_lanjut: { label: "Tindak Lanjut", color: "bg-orange-50 text-orange-700 border-orange-200" },
  };
  const { label, color } = config[status] || { label: status, color: "bg-zinc-100 text-zinc-700" };
  return <span className={`status-badge text-[11px] ${color}`}>{label}</span>;
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1, limit: 10, total: 0, totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  // Import Excel state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const fetchComplaints = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (filterStatus) params.set("status", filterStatus);
      if (filterDateFrom) params.set("dateFrom", filterDateFrom);
      if (filterDateTo) params.set("dateTo", filterDateTo);

      const res = await fetch(`/api/complaints?${params}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.data);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Fetch complaints error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterDateFrom, filterDateTo]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaints(1);
  };

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const handleDelete = async (id: number, number: string) => {
    if (!confirm(`Yakin ingin menghapus keluhan ${number}?`)) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchComplaints(pagination.page);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus keluhan");
      }
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) return;

    setImportLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", importFile);

      const res = await fetch("/api/complaints/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Berhasil mengimpor ${data.count} keluhan dari Excel!`);
        setImportModalOpen(false);
        setImportFile(null);
        fetchComplaints(1);
      } else {
        alert(data.error || "Gagal mengimpor berkas Excel");
      }
    } catch {
      alert("Terjadi kesalahan koneksi saat mengimpor berkas");
    } finally {
      setImportLoading(false);
    }
  };

  const activeFilterCount = [filterStatus, filterDateFrom, filterDateTo].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari keluhan..."
                className="form-input pl-9 w-56 text-[12px]"
              />
            </div>
          </form>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`btn btn-secondary btn-sm ${showFilter ? "!border-blue-300 !bg-blue-50 !text-blue-700" : ""}`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-0.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="btn btn-ghost btn-sm text-red-500 hover:!text-red-600"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setImportModalOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            Import Excel
          </button>

          <Link href="/dashboard/complaints/new" className="btn btn-primary btn-sm">
            <Plus className="w-3.5 h-3.5" />
            Tambah Keluhan
          </Link>
        </div>
      </div>

      {/* Import Excel Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 animate-scale-in shadow-xl">
            <h3 className="text-[15px] font-semibold text-zinc-900 mb-1">
              Import Keluhan dari Berkas Excel
            </h3>
            <p className="text-[12px] text-zinc-500 mb-4 leading-relaxed">
              Pilih berkas format formulir PT KAI (<code className="text-[11px] bg-zinc-100 px-1 py-0.5 rounded">FR.SM/TI/033.001</code>). Data keluhan, tindakan, dan verifikasi akan otomatis dimigrasi.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="border border-dashed border-zinc-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-zinc-50/50">
                <Download className="w-7 h-7 text-zinc-300 mx-auto mb-2 rotate-180" />
                <input
                  type="file"
                  id="excelFileInput"
                  accept=".xlsx, .xls"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="excelFileInput"
                  className="btn btn-secondary btn-sm cursor-pointer inline-flex"
                >
                  {importFile ? importFile.name : "Pilih Berkas Excel"}
                </label>
                <p className="text-[10px] text-zinc-400 mt-2">Mendukung .xlsx dan .xls</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setImportModalOpen(false);
                    setImportFile(null);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={importLoading || !importFile}
                  className="btn btn-primary btn-sm"
                >
                  {importLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Mulai Import"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {showFilter && (
        <div className="card p-4 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="form-label text-[12px]">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input text-[12px]"
              >
                <option value="">Semua Status</option>
                <option value="baru">Baru</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
                <option value="perlu_tindak_lanjut">Perlu Tindak Lanjut</option>
              </select>
            </div>
            <div>
              <label className="form-label text-[12px]">Dari Tanggal</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="form-input text-[12px]"
              />
            </div>
            <div>
              <label className="form-label text-[12px]">Sampai Tanggal</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="form-input text-[12px]"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => fetchComplaints(1)}
              className="btn btn-primary btn-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="ml-2 text-zinc-500 text-[13px]">Memuat data...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-zinc-100 flex items-center justify-center mx-auto mb-3">
              <Search className="w-5 h-5 text-zinc-400" />
            </div>
            <p className="text-zinc-700 font-medium text-[14px]">Tidak ada keluhan ditemukan</p>
            <p className="text-[12px] text-zinc-400 mt-1">
              Coba ubah filter atau tambah keluhan baru
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No. Keluhan</th>
                    <th>Tanggal</th>
                    <th>Pelanggan</th>
                    <th>Sumber</th>
                    <th>Status</th>
                    <th>PIC</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, i) => (
                    <tr
                      key={c.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${i * 25}ms` }}
                    >
                      <td>
                        <span className="font-mono text-[11px] font-semibold text-blue-600">
                          {c.complaintNumber}
                        </span>
                      </td>
                      <td className="text-[12px] whitespace-nowrap text-zinc-500">
                        {new Date(c.reportDate).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <p className="text-[13px] font-medium text-zinc-800">{c.customerName}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1 max-w-[200px]">
                          {c.description}
                        </p>
                      </td>
                      <td className="text-[12px] text-zinc-500">{c.source.label}</td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="text-[12px] text-zinc-500">
                        {c.pic?.name || <span className="text-zinc-300">—</span>}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-0.5">
                          <Link
                            href={`/dashboard/complaints/${c.id}`}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title="Detail"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          {(c.status === "baru" || c.status === "diproses") && (
                            <Link
                              href={`/dashboard/complaints/${c.id}/edit`}
                              className="p-1.5 rounded-md text-zinc-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                              title="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDelete(c.id, c.complaintNumber)}
                            className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-zinc-100">
              <p className="text-[12px] text-zinc-500">
                Menampilkan {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                dari {pagination.total} keluhan
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => fetchComplaints(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn btn-secondary btn-sm !px-2"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => fetchComplaints(page)}
                      className={`btn btn-sm min-w-[32px] !px-2 ${
                        page === pagination.page
                          ? "btn-primary"
                          : "btn-secondary"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => fetchComplaints(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn btn-secondary btn-sm !px-2"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
