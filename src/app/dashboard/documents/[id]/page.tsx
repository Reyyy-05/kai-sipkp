"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileSignature,
  Loader2,
  Calendar,
  AlertCircle,
  Train,
  Upload,
} from "lucide-react";
import { formatDate, getDocStatusColor, getDocStatusLabel } from "@/lib/utils";

interface DocumentDetail {
  id: number;
  documentNumber: string;
  documentDate: string;
  version: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  createdBy: { id: number; name: string; position: string | null };
  approvedBy: { id: number; name: string; position: string | null } | null;
  complaints: Array<{
    displayOrder: number;
    complaint: {
      id: number;
      reportDate: string;
      customerName: string;
      source: { label: string };
      description: string;
      correctiveAction: string | null;
      verificationDate: string | null;
      pic: { name: string } | null;
      verificationResult: string | null;
      remark: string | null;
    };
  }>;
  signatures: Array<{
    role: "pelaksana" | "management_representative";
    signedAt: string | null;
    signatureData: string | null;
    user: { id: number; name: string; position: string | null };
  }>;
}

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Signature modal state
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [signRole, setSignRole] = useState<"pelaksana" | "management_representative">(
    "pelaksana"
  );
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const fetchDoc = async () => {
    try {
      const res = await fetch(`/api/documents/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDoc(data);
      }
    } catch (err) {
      console.error("Fetch document error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, [id]);

  const handleStatusAction = async (action: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchDoc();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal memperbarui status dokumen");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSignaturePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signaturePreview) {
      alert("Silakan pilih gambar tanda tangan terlebih dahulu");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/documents/${id}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: signRole,
          signatureData: signaturePreview,
        }),
      });

      if (res.ok) {
        setSignModalOpen(false);
        setSignaturePreview(null);
        fetchDoc();
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan tanda tangan");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-lg font-semibold text-slate-800">Dokumen Tidak Ditemukan</p>
        <Link href="/dashboard/documents" className="btn btn-primary btn-sm mt-4">
          Kembali ke Dokumen
        </Link>
      </div>
    );
  }

  const pelaksanaSig = doc.signatures.find((s) => s.role === "pelaksana");
  const mgmtSig = doc.signatures.find((s) => s.role === "management_representative");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Daftar Dokumen
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status badge */}
          <span className={`status-badge text-xs ${getDocStatusColor(doc.status)}`}>
            {getDocStatusLabel(doc.status)}
          </span>

          {/* Workflow buttons */}
          {doc.status === "draft" && (
            <button
              onClick={() => handleStatusAction("submit_approval")}
              disabled={actionLoading}
              className="btn btn-secondary btn-sm"
            >
              <Clock className="w-4 h-4 text-amber-500" />
              Ajukan Persetujuan
            </button>
          )}

          {doc.status === "waiting_approval" && (
            <button
              onClick={() => handleStatusAction("approve")}
              disabled={actionLoading}
              className="btn btn-success btn-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Setujui Dokumen (Management Rep)
            </button>
          )}

          {/* Sign buttons */}
          <button
            onClick={() => {
              setSignRole("pelaksana");
              setSignModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
          >
            <FileSignature className="w-4 h-4 text-blue-600" />
            TTD Pelaksana
          </button>

          <button
            onClick={() => {
              setSignRole("management_representative");
              setSignModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
          >
            <FileSignature className="w-4 h-4 text-amber-600" />
            TTD Management Rep
          </button>

          {/* PDF Download Button */}
          <a
            href={`/api/documents/${doc.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <Download className="w-4 h-4" />
            Unduh PDF Resmi
          </a>
        </div>
      </div>

      {/* PDF Visual Preview Sheet */}
      <div className="card p-8 bg-white shadow-md border border-slate-300 animate-fade-in overflow-x-auto">
        {/* EXCEL HEADER MATCH */}
        <div className="border border-slate-900 mb-4">
          <div className="grid grid-cols-12 divide-x divide-slate-900">
            {/* Logo and Institution */}
            <div className="col-span-8 p-3 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center text-white font-black text-lg">
                KAI
              </div>
              <div className="text-center flex-1">
                <h2 className="font-bold text-sm tracking-wide text-slate-900">
                  PT KERETA API INDONESIA (PERSERO)
                </h2>
                <h3 className="font-bold text-xs tracking-wider text-slate-800">
                  SISTEM INFORMASI
                </h3>
              </div>
            </div>

            {/* Document Metadata Col */}
            <div className="col-span-4 divide-y divide-slate-900 text-xs">
              <div className="grid grid-cols-12 p-1.5">
                <span className="col-span-5 font-semibold text-slate-700">No. Dokumen</span>
                <span className="col-span-7 font-mono font-bold text-slate-900">
                  : {doc.documentNumber}
                </span>
              </div>
              <div className="grid grid-cols-12 p-1.5">
                <span className="col-span-5 font-semibold text-slate-700">Tanggal</span>
                <span className="col-span-7 font-medium text-slate-900">
                  : {formatDate(doc.documentDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Title and Version Row */}
          <div className="grid grid-cols-12 border-t border-slate-900 divide-x divide-slate-900">
            <div className="col-span-8 p-2.5 bg-slate-50 text-center font-bold text-xs text-slate-900">
              {doc.title}
            </div>
            <div className="col-span-4 p-1.5 text-xs grid grid-cols-12">
              <span className="col-span-5 font-semibold text-slate-700">Versi</span>
              <span className="col-span-7 font-mono font-bold text-slate-900">
                : {doc.version}
              </span>
            </div>
          </div>
        </div>

        {/* EXCEL TABLE MATCH */}
        <table className="w-full border-collapse border border-slate-900 text-[11px]">
          <thead>
            <tr className="bg-slate-100 text-slate-900 divide-x divide-slate-900 border-b border-slate-900">
              <th rowSpan={2} className="border border-slate-900 p-2 text-center w-8">
                No
              </th>
              <th rowSpan={2} className="border border-slate-900 p-2 text-center w-20">
                Tanggal
              </th>
              <th rowSpan={2} className="border border-slate-900 p-2 text-center w-36">
                Pelanggan
              </th>
              <th rowSpan={2} className="border border-slate-900 p-2 text-center w-24">
                Sumber
              </th>
              <th rowSpan={2} className="border border-slate-900 p-2 text-center">
                Deskripsi Keluhan
              </th>
              <th rowSpan={2} className="border border-slate-900 p-2 text-center">
                Tindakan perbaikan dan pencegahan yang diambil
              </th>
              <th colSpan={3} className="border border-slate-900 p-1.5 text-center">
                Verification
              </th>
              <th rowSpan={2} className="border border-slate-900 p-2 text-center w-28">
                Keterangan
              </th>
            </tr>
            <tr className="bg-slate-100 text-slate-900 divide-x divide-slate-900 border-b border-slate-900 text-[10px]">
              <th className="border border-slate-900 p-1 text-center w-16">Tgl</th>
              <th className="border border-slate-900 p-1 text-center w-24">PIC</th>
              <th className="border border-slate-900 p-1 text-center w-32">Hasil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {doc.complaints.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-6 text-center text-slate-400">
                  Tidak ada data keluhan pada rentang tanggal dokumen ini.
                </td>
              </tr>
            ) : (
              doc.complaints.map((item) => (
                <tr key={item.complaint.id} className="divide-x divide-slate-900">
                  <td className="border border-slate-900 p-2 text-center">
                    {item.displayOrder}
                  </td>
                  <td className="border border-slate-900 p-2 text-center whitespace-nowrap">
                    {formatDate(item.complaint.reportDate)}
                  </td>
                  <td className="border border-slate-900 p-2 font-medium">
                    {item.complaint.customerName}
                  </td>
                  <td className="border border-slate-900 p-2 text-center">
                    {item.complaint.source.label}
                  </td>
                  <td className="border border-slate-900 p-2 whitespace-pre-line">
                    {item.complaint.description}
                  </td>
                  <td className="border border-slate-900 p-2 whitespace-pre-line">
                    {item.complaint.correctiveAction || "-"}
                  </td>
                  <td className="border border-slate-900 p-2 text-center whitespace-nowrap">
                    {item.complaint.verificationDate
                      ? formatDate(item.complaint.verificationDate)
                      : "-"}
                  </td>
                  <td className="border border-slate-900 p-2 text-center">
                    {item.complaint.pic?.name || "-"}
                  </td>
                  <td className="border border-slate-900 p-2 whitespace-pre-line">
                    {item.complaint.verificationResult || "-"}
                  </td>
                  <td className="border border-slate-900 p-2">
                    {item.complaint.remark || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* SIGNATURE FOOTER */}
        <div className="grid grid-cols-2 gap-12 mt-12 pt-6 text-center text-xs">
          <div>
            <p className="font-bold text-slate-800 mb-2">Dibuat Oleh,</p>
            <div className="h-16 flex items-center justify-center my-2">
              {pelaksanaSig?.signatureData ? (
                <img
                  src={pelaksanaSig.signatureData}
                  alt="TTD Pelaksana"
                  className="max-h-16 object-contain"
                />
              ) : (
                <span className="text-slate-300 italic text-[11px]">
                  (Belum ditandatangani)
                </span>
              )}
            </div>
            <p className="font-bold underline text-slate-900">
              {pelaksanaSig?.user.name || "...................................................."}
            </p>
            <p className="text-[11px] text-slate-500">Pelaksana</p>
          </div>

          <div>
            <p className="font-bold text-slate-800 mb-2">Mengetahui,</p>
            <div className="h-16 flex items-center justify-center my-2">
              {mgmtSig?.signatureData ? (
                <img
                  src={mgmtSig.signatureData}
                  alt="TTD Management Rep"
                  className="max-h-16 object-contain"
                />
              ) : (
                <span className="text-slate-300 italic text-[11px]">
                  (Belum ditandatangani)
                </span>
              )}
            </div>
            <p className="font-bold underline text-slate-900">
              {mgmtSig?.user.name || "...................................................."}
            </p>
            <p className="text-[11px] text-slate-500">Management Representative</p>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {signModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Upload Tanda Tangan Digital
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Peran:{" "}
              <span className="font-semibold text-blue-600 capitalize">
                {signRole.replace("_", " ")}
              </span>
            </p>

            <form onSubmit={handleSignSubmit} className="space-y-4">
              <div>
                <label className="form-label">Pilih Berkas Gambar Tanda Tangan (PNG / JPG)</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageUpload}
                  className="form-input text-xs"
                  required
                />
              </div>

              {signaturePreview && (
                <div className="p-4 bg-slate-50 rounded-lg border text-center">
                  <p className="text-[10px] text-slate-400 mb-2 font-medium">
                    Preview Tanda Tangan:
                  </p>
                  <img
                    src={signaturePreview}
                    alt="Preview"
                    className="max-h-20 mx-auto object-contain"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSignModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !signaturePreview}
                  className="btn btn-primary btn-sm"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan Tanda Tangan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
