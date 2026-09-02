"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Calendar,
  Download,
  Eye,
  Loader2,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { formatDate, getDocStatusColor, getDocStatusLabel } from "@/lib/utils";

interface DocumentItem {
  id: number;
  documentNumber: string;
  documentDate: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  createdBy: { id: number; name: string };
  approvedBy: { id: number; name: string } | null;
  _count: { complaints: number };
  signatures: Array<{ role: string; signedAt: string; user: { name: string } }>;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch("/api/documents");
        if (res.ok) {
          const data = await res.json();
          setDocuments(data);
        }
      } catch (err) {
        console.error("Fetch docs error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Dokumen Laporan (FR.SM/TI/033.001)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Daftar dokumen laporan keluhan resmi yang telah di-generate dalam sistem
          </p>
        </div>

        <Link href="/dashboard/documents/new" className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" />
          Generate Dokumen Baru
        </Link>
      </div>

      {/* Document List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-slate-500">Memuat dokumen...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-medium">Belum Ada Dokumen Laporan</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Buat dokumen laporan baru berdasarkan periode keluhan pelanggan
            </p>
            <Link href="/dashboard/documents/new" className="btn btn-primary btn-sm">
              <Plus className="w-4 h-4" />
              Generate Dokumen Sekarang
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No. Dokumen</th>
                  <th>Tanggal</th>
                  <th>Periode Laporan</th>
                  <th>Jumlah Keluhan</th>
                  <th>Status Dokumen</th>
                  <th>Dibuat Oleh</th>
                  <th className="text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <td>
                      <span className="font-mono text-xs font-bold text-blue-700">
                        {doc.documentNumber}
                      </span>
                    </td>
                    <td className="text-sm">{formatDate(doc.documentDate)}</td>
                    <td className="text-sm">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {formatDate(doc.periodStart)} – {formatDate(doc.periodEnd)}
                        </span>
                      </div>
                    </td>
                    <td className="text-sm">
                      <span className="font-semibold text-slate-700">
                        {doc._count.complaints}
                      </span>{" "}
                      keluhan
                    </td>
                    <td>
                      <span
                        className={`status-badge text-[11px] ${getDocStatusColor(
                          doc.status
                        )}`}
                      >
                        {getDocStatusLabel(doc.status)}
                      </span>
                    </td>
                    <td className="text-sm text-slate-600">{doc.createdBy.name}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/documents/${doc.id}`}
                          className="btn btn-secondary btn-sm text-xs"
                          title="Lihat Detail & Tanda Tangan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </Link>
                        <a
                          href={`/api/documents/${doc.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm text-xs"
                          title="Download PDF Resmi"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
