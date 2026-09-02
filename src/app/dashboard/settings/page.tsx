"use client";

import {
  Settings,
  Shield,
  FileText,
  Server,
  Database,
  Building,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Pengaturan Sistem</h2>
        <p className="text-xs text-slate-500 mt-1">
          Konfigurasi aplikasi SI-PKP dan parameter dokumen standar PT KAI
        </p>
      </div>

      {/* Document Template Spec */}
      <div className="card p-6 space-y-4 animate-fade-in">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">
              Standar Dokumen Formulir PT KAI
            </h3>
            <p className="text-xs text-slate-400">
              Parameter template formulir laporan keluhan resmi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg space-y-1">
            <span className="text-slate-400 font-medium">Nomor Dokumen Standar</span>
            <p className="font-mono font-bold text-slate-800 text-sm">FR.SM/TI/033.001</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg space-y-1">
            <span className="text-slate-400 font-medium">Versi Template</span>
            <p className="font-mono font-bold text-slate-800 text-sm">002-2020</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg space-y-1">
            <span className="text-slate-400 font-medium">Format Nomor Keluhan</span>
            <p className="font-mono font-bold text-blue-700 text-sm">KAI-YYYYMM-XXXXX (5 Digit)</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg space-y-1">
            <span className="text-slate-400 font-medium">Satuan Kerja Penerbit</span>
            <p className="font-semibold text-slate-800 text-sm">Sistem Informasi (TI)</p>
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="card p-6 space-y-4 animate-fade-in">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Identitas Perusahaan</h3>
            <p className="text-xs text-slate-400">Metadata institusi pada header PDF</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="form-label">Nama Perusahaan</label>
            <input
              type="text"
              defaultValue="PT KERETA API INDONESIA (PERSERO)"
              className="form-input text-xs bg-slate-50"
              readOnly
            />
          </div>
          <div>
            <label className="form-label">Divisi Penanggung Jawab</label>
            <input
              type="text"
              defaultValue="SISTEM INFORMASI"
              className="form-input text-xs bg-slate-50"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Engine & Database Status */}
      <div className="card p-6 space-y-4 animate-fade-in">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">
              Status Infrastruktur & Engine
            </h3>
            <p className="text-xs text-slate-400">Pemeriksaan komponen aktif</p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-slate-700">Database PostgreSQL 15</span>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Terkoneksi (Port 5432)
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-slate-700">Engine PDF Puppeteer</span>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Siap (Headless Chromium)
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-slate-700">Autentikasi & Audit Trail</span>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Aktif (RBAC & Event Logger)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
