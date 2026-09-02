"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface ComplaintSource {
  id: number;
  label: string;
}

export default function EditComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [sources, setSources] = useState<ComplaintSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [complaintNumber, setComplaintNumber] = useState("");

  const [form, setForm] = useState({
    reportDate: "",
    customerName: "",
    sourceId: 0,
    description: "",
    correctiveAction: "",
    remark: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [sourceRes, complaintRes] = await Promise.all([
          fetch("/api/sources"),
          fetch(`/api/complaints/${id}`),
        ]);

        if (sourceRes.ok) {
          const s = await sourceRes.json();
          setSources(s);
        }

        if (complaintRes.ok) {
          const c = await complaintRes.json();
          setComplaintNumber(c.complaintNumber);
          setForm({
            reportDate: c.reportDate ? c.reportDate.split("T")[0] : "",
            customerName: c.customerName,
            sourceId: c.source.id,
            description: c.description,
            correctiveAction: c.correctiveAction || "",
            remark: c.remark || "",
          });
        }
      } catch (err) {
        console.error("Load edit error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push(`/dashboard/complaints/${id}`);
      } else {
        const data = await res.json();
        alert(data.error || "Gagal memperbarui data");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href={`/dashboard/complaints/${id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Detail
      </Link>

      <div className="card p-8 animate-fade-in">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Edit Keluhan: {complaintNumber}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ubah informasi terkait keluhan pelanggan
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Tanggal Lapor</label>
              <input
                type="date"
                value={form.reportDate}
                onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Sumber Keluhan</label>
              <select
                value={form.sourceId}
                onChange={(e) =>
                  setForm({ ...form, sourceId: parseInt(e.target.value) })
                }
                className="form-input"
                required
              >
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Nama Pelanggan / Instansi</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Deskripsi Keluhan</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Tindakan Perbaikan & Pencegahan</label>
            <textarea
              rows={3}
              value={form.correctiveAction}
              onChange={(e) => setForm({ ...form, correctiveAction: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Keterangan Tambahan</label>
            <input
              type="text"
              value={form.remark}
              onChange={(e) => setForm({ ...form, remark: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href={`/dashboard/complaints/${id}`}
              className="btn btn-secondary"
            >
              Batal
            </Link>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
