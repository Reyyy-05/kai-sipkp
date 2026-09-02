"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileEdit,
  Trash2,
  CheckCircle2,
  Loader2,
  Send,
  History,
  Info,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AuditLog {
  id: number;
  action: string;
  fieldChanged: string | null;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
  user: { id: number; name: string };
}

interface ComplaintDetail {
  id: number;
  complaintNumber: string;
  reportDate: string;
  customerName: string;
  description: string;
  correctiveAction: string | null;
  verificationDate: string | null;
  verificationResult: string | null;
  remark: string | null;
  status: string;
  source: { id: number; label: string };
  pic: { id: number; name: string; position: string | null } | null;
  createdBy: { id: number; name: string };
  updatedBy: { id: number; name: string } | null;
  createdAt: string;
  updatedAt: string;
  auditLogs: AuditLog[];
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    baru: { label: "Baru", color: "bg-blue-100 text-blue-700 border-blue-200" },
    diproses: { label: "Diproses", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    selesai: { label: "Selesai", color: "bg-green-100 text-green-700 border-green-200" },
    ditolak: { label: "Ditolak", color: "bg-red-100 text-red-700 border-red-200" },
    perlu_tindak_lanjut: { label: "Perlu Tindak Lanjut", color: "bg-orange-100 text-orange-700 border-orange-200" },
  };
  const { label, color } = config[status] || { label: status, color: "bg-gray-100 text-gray-700" };
  return <span className={`status-badge ${color}`}>{label}</span>;
}

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals / Action forms
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionText, setActionText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyDate, setVerifyDate] = useState(new Date().toISOString().split("T")[0]);
  const [verifyResult, setVerifyResult] = useState("");
  const [verifyRemark, setVerifyRemark] = useState("");
  const [needsFollowUp, setNeedsFollowUp] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/complaints/${id}`);
      if (res.ok) {
        const data = await res.json();
        setComplaint(data);
        if (data.correctiveAction) {
          setActionText(data.correctiveAction);
        }
      }
    } catch (err) {
      console.error("Fetch detail error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAssignAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionText.trim()) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correctiveAction: actionText }),
      });

      if (res.ok) {
        setActionModalOpen(false);
        fetchDetail();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menetapkan tindakan");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyResult.trim()) return;
    setVerifyLoading(true);

    try {
      const res = await fetch(`/api/complaints/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationDate: verifyDate,
          verificationResult: verifyResult,
          remark: verifyRemark,
          needsFollowUp,
        }),
      });

      if (res.ok) {
        setVerifyModalOpen(false);
        fetchDetail();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal memverifikasi keluhan");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Hapus keluhan ${complaint?.complaintNumber}? Data tidak dapat dipulihkan.`))
      return;
    try {
      const res = await fetch(`/api/complaints/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/complaints");
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menghapus");
      }
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-lg font-semibold text-slate-800">Keluhan Tidak Ditemukan</p>
        <Link href="/dashboard/complaints" className="btn btn-primary btn-sm mt-4">
          Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/complaints"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Daftar Keluhan
        </Link>

        <div className="flex items-center gap-2">
          {complaint.status === "baru" && (
            <button
              onClick={() => setActionModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <Send className="w-4 h-4" />
              Tetapkan Tindakan
            </button>
          )}

          {(complaint.status === "diproses" || complaint.status === "perlu_tindak_lanjut") && (
            <button
              onClick={() => setVerifyModalOpen(true)}
              className="btn btn-success btn-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Verifikasi Hasil
            </button>
          )}

          <Link
            href={`/dashboard/complaints/${id}/edit`}
            className="btn btn-secondary btn-sm"
          >
            <FileEdit className="w-4 h-4" />
            Edit
          </Link>

          <button onClick={handleDelete} className="btn btn-danger btn-sm">
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="card p-8 animate-fade-in space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono text-blue-700">
                {complaint.complaintNumber}
              </h1>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dibuat oleh {complaint.createdBy.name} pada {formatDate(complaint.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Tgl Lapor</p>
                <p className="font-medium text-slate-800">{formatDate(complaint.reportDate)}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Sumber</p>
                <p className="font-medium text-slate-800">{complaint.source.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pelanggan / Instansi
            </span>
            <div className="flex items-start gap-2.5 pt-1">
              <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 text-base">{complaint.customerName}</p>
                <p className="text-xs text-slate-500 mt-0.5">Pengguna Layanan KAI</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Deskripsi Keluhan (Form Excel Col E)
            </span>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-line mt-1">
              {complaint.description}
            </div>
          </div>
        </div>

        {/* Corrective Action Section */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Tindakan Perbaikan dan Pencegahan (Form Excel Col F)
            </span>
            {complaint.status === "baru" && (
              <span className="text-xs text-amber-600 font-medium bg-amber-100/80 px-2 py-0.5 rounded">
                Menunggu Tindakan
              </span>
            )}
          </div>
          {complaint.correctiveAction ? (
            <p className="text-sm text-slate-800 whitespace-pre-line pt-2 leading-relaxed">
              {complaint.correctiveAction}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic pt-2">
              Belum ada tindakan yang ditetapkan. Klik tombol &ldquo;Tetapkan Tindakan&rdquo; di atas.
            </p>
          )}
        </div>

        {/* Verification Section */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-100 space-y-4">
          <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verifikasi Hasil Tindakan (Form Excel Col G-J)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <p className="text-xs text-slate-500 font-medium">Tanggal Verifikasi (Col G)</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {formatDate(complaint.verificationDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">PIC Penanggung Jawab (Col H)</p>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                {complaint.pic?.name || "-"}
              </p>
              {complaint.pic?.position && (
                <p className="text-[11px] text-slate-400">{complaint.pic.position}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Status Verifikasi</p>
              <div className="mt-1">
                <StatusBadge status={complaint.status} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 font-medium">Hasil Verifikasi (Col I-J)</p>
            {complaint.verificationResult ? (
              <p className="text-sm text-slate-800 whitespace-pre-line pt-1 leading-relaxed">
                {complaint.verificationResult}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic pt-1">Belum diverifikasi.</p>
            )}
          </div>

          {complaint.remark && (
            <div className="pt-2 border-t border-emerald-200/50">
              <p className="text-xs text-slate-500 font-medium">Keterangan Tambahan (Col K-O)</p>
              <p className="text-sm text-slate-700 mt-1">{complaint.remark}</p>
            </div>
          )}
        </div>

        {/* Audit Log Timeline */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-800">Riwayat Perubahan (Audit Trail)</h3>
          </div>

          {complaint.auditLogs.length === 0 ? (
            <p className="text-xs text-slate-400">Belum ada riwayat tercatat.</p>
          ) : (
            <div className="space-y-3">
              {complaint.auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 text-xs p-3 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-slate-700">{log.user.name}</span>{" "}
                    <span className="text-slate-500">
                      melakukan <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[11px]">{log.action}</code>
                      {log.fieldChanged && ` pada field ${log.fieldChanged}`}
                    </span>
                    {log.oldValue && log.newValue && (
                      <p className="text-slate-500 mt-1">
                        Dari <span className="text-red-600 line-through">{log.oldValue}</span> menjadi{" "}
                        <span className="text-green-600 font-medium">{log.newValue}</span>
                      </p>
                    )}
                  </div>
                  <span className="text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Modal: Assign Corrective Action */}
      {actionModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Tetapkan Tindakan Perbaikan & Pencegahan
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Status keluhan akan otomatis berubah menjadi <span className="font-semibold text-yellow-700">Diproses</span>.
            </p>

            <form onSubmit={handleAssignAction} className="space-y-4">
              <div>
                <label className="form-label">Uraian Tindakan Perbaikan</label>
                <textarea
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="Tindakan yang harus dilakukan untuk memperbaiki / mencegah keluhan..."
                  rows={5}
                  className="form-input text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActionModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn btn-primary btn-sm"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan & Proses"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify Modal: PIC Verification */}
      {verifyModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Verifikasi Hasil Tindakan (PIC)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Input hasil evaluasi pelaksanaan tindakan perbaikan & pencegahan.
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="form-label">Tanggal Verifikasi</label>
                <input
                  type="date"
                  value={verifyDate}
                  onChange={(e) => setVerifyDate(e.target.value)}
                  className="form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="form-label">Hasil Tindakan Perbaikan</label>
                <textarea
                  value={verifyResult}
                  onChange={(e) => setVerifyResult(e.target.value)}
                  placeholder="Hasil dari tindakan perbaikan / pencegahan yang telah diverifikasi..."
                  rows={4}
                  className="form-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="form-label">Keterangan Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={verifyRemark}
                  onChange={(e) => setVerifyRemark(e.target.value)}
                  placeholder="Keterangan lain terkait penanganan keluhan"
                  className="form-input text-sm"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200">
                <input
                  type="checkbox"
                  id="followUpCheck"
                  checked={needsFollowUp}
                  onChange={(e) => setNeedsFollowUp(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="followUpCheck" className="text-xs font-medium text-orange-800">
                  Hasil belum memadai (tandai &ldquo;Perlu Tindak Lanjut&rdquo;)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={verifyLoading}
                  className="btn btn-success btn-sm"
                >
                  {verifyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Verifikasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
