"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface ComplaintSource {
  id: number;
  name: string;
  label: string;
}

export default function NewComplaintPage() {
  const router = useRouter();
  const [sources, setSources] = useState<ComplaintSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    reportDate: new Date().toISOString().split("T")[0],
    customerName: "",
    sourceId: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/sources")
      .then((r) => r.json())
      .then((data) => setSources(data))
      .catch(() => {
        // Fallback sources
        setSources([
          { id: 1, name: "telepon", label: "Via Telepon" },
          { id: 2, name: "email", label: "Via Email" },
          { id: 3, name: "survey", label: "Survey Kepuasan Pelanggan" },
          { id: 4, name: "langsung", label: "Laporan Secara Langsung" },
          { id: 5, name: "media_sosial", label: "Media Sosial" },
          { id: 6, name: "surat", label: "Surat Resmi" },
        ]);
      });
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.reportDate) errs.reportDate = "Tanggal lapor wajib diisi";
    if (!form.customerName || form.customerName.length < 2)
      errs.customerName = "Nama pelanggan minimal 2 karakter";
    if (!form.sourceId) errs.sourceId = "Sumber keluhan wajib dipilih";
    if (!form.description || form.description.length < 10)
      errs.description = "Deskripsi keluhan minimal 10 karakter";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sourceId: parseInt(form.sourceId),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/complaints/${data.id}`);
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || "Gagal menyimpan keluhan" });
      }
    } catch {
      setErrors({ submit: "Terjadi kesalahan koneksi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard/complaints"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Keluhan
      </Link>

      <div className="card p-8 animate-fade-in">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">
            Tambah Keluhan Baru
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Isi form berikut untuk mencatat keluhan pelanggan. Nomor keluhan
            akan di-generate otomatis.
          </p>
        </div>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Date + Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="reportDate" className="form-label">
                Tanggal Lapor <span className="text-red-500">*</span>
              </label>
              <input
                id="reportDate"
                type="date"
                value={form.reportDate}
                onChange={(e) =>
                  setForm({ ...form, reportDate: e.target.value })
                }
                className={`form-input ${errors.reportDate ? "!border-red-400" : ""}`}
              />
              {errors.reportDate && (
                <p className="form-error">{errors.reportDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="sourceId" className="form-label">
                Sumber Keluhan <span className="text-red-500">*</span>
              </label>
              <select
                id="sourceId"
                value={form.sourceId}
                onChange={(e) =>
                  setForm({ ...form, sourceId: e.target.value })
                }
                className={`form-input ${errors.sourceId ? "!border-red-400" : ""}`}
              >
                <option value="">— Pilih Sumber —</option>
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              {errors.sourceId && (
                <p className="form-error">{errors.sourceId}</p>
              )}
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="customerName" className="form-label">
              Nama Pelanggan / Instansi{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
              placeholder="Nama personil atau instansi pengguna layanan KAI"
              className={`form-input ${errors.customerName ? "!border-red-400" : ""}`}
            />
            {errors.customerName && (
              <p className="form-error">{errors.customerName}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="form-label">
              Deskripsi Keluhan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Uraikan deskripsi keluhan yang dialami oleh pelanggan secara detail..."
              rows={5}
              className={`form-input resize-y ${errors.description ? "!border-red-400" : ""}`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="form-error">{errors.description}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-slate-400">
                {form.description.length}/5000
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard/complaints"
              className="btn btn-secondary"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Keluhan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
