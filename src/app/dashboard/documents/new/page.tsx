"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function NewDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Default to current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [form, setForm] = useState({
    periodType: "monthly",
    periodStart: firstDay,
    periodEnd: lastDay,
    title: "DOKUMENTASI PENGELOLAAN DAN PENANGANAN KELUHAN PELANGGAN",
  });

  const handlePeriodChange = (type: string) => {
    const d = new Date();
    let start = "";
    let end = "";

    if (type === "monthly") {
      start = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
      end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
    } else if (type === "quarterly") {
      const q = Math.floor(d.getMonth() / 3);
      start = new Date(d.getFullYear(), q * 3, 1).toISOString().split("T")[0];
      end = new Date(d.getFullYear(), (q + 1) * 3, 0).toISOString().split("T")[0];
    } else if (type === "yearly") {
      start = new Date(d.getFullYear(), 0, 1).toISOString().split("T")[0];
      end = new Date(d.getFullYear(), 11, 31).toISOString().split("T")[0];
    }

    setForm({
      ...form,
      periodType: type,
      periodStart: start || form.periodStart,
      periodEnd: end || form.periodEnd,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const doc = await res.json();
        router.push(`/dashboard/documents/${doc.id}`);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal membuat dokumen");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/documents"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Dokumen
      </Link>

      <div className="card p-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-xl gradient-kai flex items-center justify-center text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Generate Dokumen Laporan PDF
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar Dokumen FR.SM/TI/033.001 PT Kereta Api Indonesia
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Title */}
          <div>
            <label className="form-label">Judul Dokumen</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="form-input text-sm font-medium"
              required
            />
          </div>

          {/* Period Type */}
          <div>
            <label className="form-label">Pilihan Periode</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: "monthly", label: "Bulanan" },
                { id: "quarterly", label: "Triwulan" },
                { id: "yearly", label: "Tahunan" },
                { id: "custom", label: "Kustom" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePeriodChange(p.id)}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                    form.periodType === p.id
                      ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tanggal Awal Periode</label>
              <input
                type="date"
                value={form.periodStart}
                onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
                className="form-input text-sm"
                required
              />
            </div>
            <div>
              <label className="form-label">Tanggal Akhir Periode</label>
              <input
                type="date"
                value={form.periodEnd}
                onChange={(e) => setForm({ ...form, periodEnd: e.target.value })}
                className="form-input text-sm"
                required
              />
            </div>
          </div>

          {/* Info banner */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 leading-relaxed">
              Sistem akan otomatis menghimpun semua keluhan pelanggan yang tercatat
              dalam rentang tanggal di atas, mengurutkan berdasarkan nomor urut,
              dan menyusun form tabel sesuai spesifikasi FR.SM/TI/033.001.
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/dashboard/documents" className="btn btn-secondary">
              Batal
            </Link>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengemas Dokumen...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Generate Dokumen
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
