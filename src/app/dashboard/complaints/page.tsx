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
    baru: { label: "Baru", color: "bg-blue-100 text-blue-700 border-blue-200" },
    diproses: { label: "Diproses", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    selesai: { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200" },
    ditolak: { label: "Ditolak", color: "bg-red-100 text-red-700 border-red-200" },
    perlu_tindak_lanjut: { label: "Tindak Lanjut", color: "bg-orange-100 text-orange-700 border-orange-200" },
  };
  const { label, color } = config[status] || { label: status, color: "bg-gray-100 text-gray-700" };
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

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari keluhan..."
                className="form-input pl-9 w-64 text-sm"
              />
            </div>
          </form>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`btn btn-secondary btn-sm ${showFilter ? "!bg-blue-50 !text-blue-600 !border-blue-200" : ""}`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          {(filterStatus || filterDateFrom || filterDateTo) && (
            <button
              onClick={clearFilters}
              className="btn btn-sm text-red-500 hover:bg-red-50"
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
            <Upload className="w-4 h-4 text-emerald-600" />
            Import Excel
          </button>

          <Link href="/dashboard/complaints/new" className="btn btn-primary btn-sm">
            <Plus className="w-4 h-4" />
            Tambah Keluhan
          </Link>
        </div>
      </div>

      {/* Import Excel Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Import Keluhan dari Berkas Excel
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Pilih berkas format formulir PT KAI (<code>FR.SM/TI/033.001</code>). Data keluhan, tindakan, dan verifikasi akan otomatis dimigrasi.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
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
                <p className="text-[11px] text-slate-400 mt-2">Mendukung .xlsx dan .xls</p>
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
                      <Loader2 className="w-4 h-4 animate-spin" />
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
        <div className="card p-4 animate-scale-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-input text-sm"
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
              <label className="form-label">Dari Tanggal</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="form-input text-sm"
              />
            </div>
            <div>
              <label className="form-label">Sampai Tanggal</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="form-input text-sm"
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
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-slate-500 text-sm">Memuat data...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">Tidak ada keluhan ditemukan</p>
            <p className="text-sm text-slate-400 mt-1">
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
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td>
                        <span className="font-mono text-xs font-semibold text-blue-600">
                          {c.complaintNumber}
                        </span>
                      </td>
                      <td className="text-sm whitespace-nowrap">
                        {new Date(c.reportDate).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <p className="text-sm font-medium text-slate-700">{c.customerName}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">
                          {c.description}
                        </p>
                      </td>
                      <td className="text-sm text-slate-500">{c.source.label}</td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="text-sm text-slate-500">
                        {c.pic?.name || "-"}
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/complaints/${c.id}`}
                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            title="Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {(c.status === "baru" || c.status === "diproses") && (
                            <Link
                              href={`/dashboard/complaints/${c.id}/edit`}
                              className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDelete(c.id, c.complaintNumber)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-slate-100">
              <p className="text-sm text-slate-500">
                Menampilkan {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                dari {pagination.total} keluhan
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchComplaints(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => fetchComplaints(page)}
                      className={`btn btn-sm min-w-[36px] ${
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
                  className="btn btn-secondary btn-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
